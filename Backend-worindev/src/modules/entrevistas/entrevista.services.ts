import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import transporter from '../../config/mailer'
import { emailEntrevista } from '../../utils/email.templates'

const UMBRAL_MATCH   = 93   // % mínimo para ser convocado
const MAX_CANDIDATOS = 10   // máximo por entrevista grupal
const HORAS_CONFIRMAR = 12  // horas para confirmar

const include = {
  vacante:      { include: { empresa: { select: { nombre: true } } } },
  invitaciones: { include: { entrevista: { include: { vacante: { include: { empresa: true } } } } } },
}

export const listarEntrevistas = async (query: any, user: any) => {
  let filtroExtra: any = {}

  if (user.rol === 'EMPRESA') {
    const e = await prisma.empresa.findFirst({ where: { usuarioId: user.id } })
    if (!e) return []
    filtroExtra.vacante = { empresaId: e.id }
  }
  if (user.rol === 'CANDIDATO') {
    const c = await prisma.candidato.findFirst({ where: { usuarioId: user.id } })
    if (!c) return []
    filtroExtra.invitaciones = { some: { candidatoId: c.id } }
  }

  return prisma.entrevistaGrupal.findMany({
    where: {
      ...filtroExtra,
      ...(query.vacanteId ? { vacanteId: Number(query.vacanteId) } : {}),
      ...(query.estado    ? { estado: query.estado as any }         : {}),
    },
    include,
    orderBy: { fecha: 'asc' },
  })
}

export const obtenerEntrevista = async (id: number) => {
  const e = await prisma.entrevistaGrupal.findUnique({ where: { id }, include })
  if (!e) throw new AppError('Entrevista no encontrada', 404)
  return e
}

/**
 * Crear entrevista grupal y convocar automáticamente a los candidatos
 * con matchScore >= UMBRAL_MATCH para la vacante dada
 */
export const crearEntrevista = async (data: any) => {
  const { vacanteId, fecha, modalidad, enlace, direccion } = data

  if (!vacanteId || !fecha) throw new AppError('vacanteId y fecha son requeridos', 400)

  const vacante = await prisma.vacante.findUnique({
    where: { id: Number(vacanteId) },
    include: { empresa: true }
  })
  if (!vacante) throw new AppError('Vacante no encontrada', 404)

  // Buscar candidatos con match >= umbral para esta vacante
  const postulaciones = await prisma.postulacion.findMany({
    where: {
      vacanteId:  Number(vacanteId),
      matchScore: { gte: UMBRAL_MATCH },
      estado:     { in: ['PENDIENTE', 'EN_REVISION'] },
    },
    include: {
      candidato: { include: { usuario: { select: { email: true } } } }
    },
    orderBy: { matchScore: 'desc' },
    take: MAX_CANDIDATOS,
  })

  if (postulaciones.length === 0)
    throw new AppError(`No hay candidatos con ${UMBRAL_MATCH}%+ de compatibilidad para esta vacante`, 400)

  const fechaObj   = new Date(fecha)
  const expiresAt  = new Date(fechaObj.getTime() - HORAS_CONFIRMAR * 60 * 60 * 1000)

  const entrevista = await prisma.$transaction(async (tx) => {
    const e = await tx.entrevistaGrupal.create({
      data: {
        vacanteId:    Number(vacanteId),
        fecha:        fechaObj,
        modalidad:    modalidad ?? 'PRESENCIAL',
        enlace:       enlace    ?? null,
        direccion:    direccion ?? null,
        maxCandidatos: MAX_CANDIDATOS,
      }
    })

    // Crear invitaciones
    await tx.invitacionEntrevista.createMany({
      data: postulaciones.map(p => ({
        entrevistaId: e.id,
        candidatoId:  p.candidatoId,
        expiresAt,
      }))
    })

    // Actualizar estado de postulaciones a ENTREVISTA
    await tx.postulacion.updateMany({
      where: { id: { in: postulaciones.map(p => p.id) } },
      data:  { estado: 'ENTREVISTA' }
    })

    return e
  })

  // Enviar emails de convocatoria
  const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '')
  const fechaStr = fechaObj.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const horaStr  = fechaObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const invitaciones = await prisma.invitacionEntrevista.findMany({
    where: { entrevistaId: entrevista.id },
    include: { 
      entrevista: { include: { vacante: { include: { empresa: true } } } },
      candidato: { include: { usuario: true } }
    }
  })

  await Promise.allSettled(
    invitaciones.map(inv => {
      const mail = emailEntrevista({
        nombre:        `${inv.candidato.nombre} ${inv.candidato.apellido}`.trim(),
        vacante:       vacante.titulo,
        empresa:       vacante.empresa.nombre,
        fecha:         fechaStr,
        hora:          horaStr,
        modalidad:     modalidad ?? 'PRESENCIAL',
        enlace:        enlace,
        direccion:     direccion,
        confirmUrl:    `${base}/entrevistas/confirmar/${inv.tokenConfirm}`,
        expiresHoras:  HORAS_CONFIRMAR,
      })
      return transporter.sendMail({ from: process.env.MAIL_FROM, to: inv.candidato.usuario.email, ...mail })
    })
  )

  return {
    message:     `Entrevista creada. ${postulaciones.length} candidatos convocados.`,
    entrevista,
    convocados:  postulaciones.length,
  }
}

export const cambiarEstado = async (id: number, estado: string) => {
  const estados = ['PROGRAMADA', 'REALIZADA', 'CANCELADA']
  if (!estados.includes(estado)) throw new AppError(`Estado inválido. Opciones: ${estados.join(', ')}`, 400)

  const e = await prisma.entrevistaGrupal.update({ 
    where: { id }, 
    data: { estado: estado as any },
    include: { 
      vacante: { include: { empresa: { select: { nombre: true } } } },
      invitaciones: { include: { candidato: true } }
    }
  })
  return { message: 'Estado actualizado', entrevista: e }
}

export const eliminarEntrevista = async (id: number) => {
  const e = await prisma.entrevistaGrupal.findUnique({ where: { id } })
  if (!e) throw new AppError('Entrevista no encontrada', 404)
  await prisma.entrevistaGrupal.delete({ where: { id } })
  return { message: 'Entrevista eliminada' }
}

export const confirmarAsistencia = async (token: string) => {
  const inv = await prisma.invitacionEntrevista.findUnique({
    where: { tokenConfirm: token },
    include: { 
      entrevista: { include: { vacante: { include: { empresa: true } } } },
      candidato: { include: { usuario: { select: { email: true } } } }
    }
  })

  if (!inv) throw new AppError('Token de confirmación inválido', 400)
  if (inv.confirmado) return { message: 'Ya confirmaste tu asistencia anteriormente' }
  if (inv.expiresAt < new Date()) throw new AppError('El tiempo para confirmar ha expirado', 410)

  await prisma.invitacionEntrevista.update({
    where: { id: inv.id },
    data:  { confirmado: true, respondidoAt: new Date() }
  })

  return {
    message:   '¡Asistencia confirmada! Te esperamos en la entrevista.',
    entrevista: {
      vacante:   inv.entrevista.vacante.titulo,
      empresa:   inv.entrevista.vacante.empresa.nombre,
      fecha:     inv.entrevista.fecha,
      modalidad: inv.entrevista.modalidad,
      enlace:    inv.entrevista.enlace,
      direccion: inv.entrevista.direccion,
    }
  }
}
