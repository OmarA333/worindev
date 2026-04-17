import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import { calcularMatchConVacante } from '../matching/matching.services'
import transporter from '../../config/mailer'
import { emailEntrevista } from '../../utils/email.templates'

const UMBRAL_AUTO    = 93
const MAX_CANDIDATOS = 10
const HORAS_CONFIRMAR = 12

const include = {
  vacante:   { include: { empresa: { select: { nombre: true, logoUrl: true } } } },
  candidato: { select: { nombre: true, apellido: true, matchScore: true, foto: true } },
}

export const listarPostulaciones = async (query: any, user: any) => {
  const { vacanteId, candidatoId, estado } = query

  let filtroExtra: any = {}
  if (user.rol === 'CANDIDATO') {
    const c = await prisma.candidato.findFirst({ where: { usuarioId: user.id } })
    if (!c) return []
    filtroExtra.candidatoId = c.id
  }
  if (user.rol === 'EMPRESA') {
    const e = await prisma.empresa.findFirst({ where: { usuarioId: user.id } })
    if (!e) return []
    filtroExtra.vacante = { empresaId: e.id }
  }

  return prisma.postulacion.findMany({
    where: {
      ...filtroExtra,
      ...(vacanteId   ? { vacanteId:   Number(vacanteId) }   : {}),
      ...(candidatoId ? { candidatoId: Number(candidatoId) } : {}),
      ...(estado      ? { estado: estado as any }             : {}),
    },
    include,
    orderBy: { matchScore: 'desc' },
  })
}

export const obtenerPostulacion = async (id: number) => {
  const p = await prisma.postulacion.findUnique({ where: { id }, include })
  if (!p) throw new AppError('Postulación no encontrada', 404)
  return p
}

export const postular = async (data: any, user: any) => {
  const { vacanteId } = data
  if (!vacanteId) throw new AppError('vacanteId es requerido', 400)

  const candidato = await prisma.candidato.findFirst({
    where: { usuarioId: user.id },
    include: { usuario: { select: { email: true } } },
  })
  if (!candidato) throw new AppError('Perfil de candidato no encontrado', 404)

  const vacante = await prisma.vacante.findUnique({
    where: { id: Number(vacanteId) },
    include: { empresa: true },
  })
  if (!vacante) throw new AppError('Vacante no encontrada', 404)
  if (vacante.estado !== 'ACTIVA') throw new AppError('Esta vacante no está activa', 409)

  const yaPostulado = await prisma.postulacion.findUnique({
    where: { vacanteId_candidatoId: { vacanteId: Number(vacanteId), candidatoId: candidato.id } }
  })
  if (yaPostulado) throw new AppError('Ya te postulaste a esta vacante', 409)

  const matchScore = await calcularMatchConVacante(candidato.id, Number(vacanteId))

  // ── Confirmación automática si matchScore >= 93% ──────────────────────────
  const autoConfirmado = matchScore >= UMBRAL_AUTO
  const estadoInicial  = autoConfirmado ? 'ENTREVISTA' : 'PENDIENTE'

  const postulacion = await prisma.postulacion.create({
    data: { vacanteId: Number(vacanteId), candidatoId: candidato.id, matchScore, estado: estadoInicial },
    include,
  })

  if (autoConfirmado) {
    // Buscar entrevista grupal existente para esta vacante con cupo disponible
    let entrevista = await prisma.entrevistaGrupal.findFirst({
      where: {
        vacanteId: Number(vacanteId),
        estado:    'PROGRAMADA',
      },
      include: { _count: { select: { invitaciones: true } } },
      orderBy: { fecha: 'asc' },
    })

    // Si no hay entrevista o está llena, crear una nueva (fecha tentativa: 7 días)
    if (!entrevista || (entrevista as any)._count.invitaciones >= MAX_CANDIDATOS) {
      const fecha     = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      entrevista = await prisma.entrevistaGrupal.create({
        data: {
          vacanteId:     Number(vacanteId),
          fecha,
          modalidad:     'PRESENCIAL',
          maxCandidatos: MAX_CANDIDATOS,
        },
        include: { _count: { select: { invitaciones: true } } },
      })
    }

    const expiresAt = new Date(entrevista.fecha.getTime() - HORAS_CONFIRMAR * 60 * 60 * 1000)

    // Crear invitación
    const invitacion = await prisma.invitacionEntrevista.create({
      data: { entrevistaId: entrevista.id, candidatoId: candidato.id, expiresAt },
    })

    // Enviar email de convocatoria
    const base     = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '')
    const fechaStr = entrevista.fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const horaStr  = entrevista.fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

    const mail = emailEntrevista({
      nombre:       `${candidato.nombre} ${candidato.apellido}`.trim(),
      vacante:      vacante.titulo,
      empresa:      vacante.empresa.nombre,
      fecha:        fechaStr,
      hora:         horaStr,
      modalidad:    entrevista.modalidad,
      enlace:       entrevista.enlace ?? undefined,
      direccion:    entrevista.direccion ?? undefined,
      confirmUrl:   `${base}/entrevistas/confirmar/${invitacion.tokenConfirm}`,
      expiresHoras: HORAS_CONFIRMAR,
    })

    await transporter.sendMail({ from: process.env.MAIL_FROM, to: candidato.usuario.email, ...mail })
      .catch(console.error)
  }

  return {
    message:         autoConfirmado
      ? `¡Felicitaciones! Tu compatibilidad es ${matchScore}%. Fuiste convocado automáticamente a entrevista grupal.`
      : 'Postulación enviada exitosamente',
    postulacion,
    matchScore,
    autoConfirmado,
  }
}

export const cambiarEstado = async (id: number, estado: string, notasAdmin?: string) => {
  const estados = ['PENDIENTE', 'EN_REVISION', 'ENTREVISTA', 'RECHAZADO', 'ACEPTADO']
  if (!estados.includes(estado)) throw new AppError(`Estado inválido. Opciones: ${estados.join(', ')}`, 400)

  const p = await prisma.postulacion.update({
    where: { id },
    data: { estado: estado as any, ...(notasAdmin !== undefined && { notasAdmin }) },
    include,
  })
  return { message: 'Estado actualizado', postulacion: p }
}

export const retirarPostulacion = async (id: number) => {
  const p = await prisma.postulacion.findUnique({ where: { id } })
  if (!p) throw new AppError('Postulación no encontrada', 404)
  if (['ACEPTADO', 'RECHAZADO'].includes(p.estado))
    throw new AppError('No se puede retirar una postulación ya finalizada', 409)

  await prisma.postulacion.delete({ where: { id } })
  return { message: 'Postulación retirada' }
}

/**
 * Recalcula el match score de todas las postulaciones de un candidato
 * y genera citaciones automáticas si alcanza el 93%
 */
export const recalcularMatchPostulaciones = async (candidatoId: number) => {
  const postulaciones = await prisma.postulacion.findMany({
    where: { candidatoId, estado: { in: ['PENDIENTE', 'EN_REVISION'] } },
    include: { 
      vacante: { include: { empresa: true } },
      candidato: { include: { usuario: { select: { email: true } } } }
    }
  })

  const resultados = []

  for (const postulacion of postulaciones) {
    const nuevoMatch = await calcularMatchConVacante(candidatoId, postulacion.vacanteId)
    
    await prisma.postulacion.update({
      where: { id: postulacion.id },
      data: { matchScore: nuevoMatch }
    })

    // Si alcanza el 93% y no estaba en ENTREVISTA, generar citación automática
    if (nuevoMatch >= UMBRAL_AUTO && postulacion.estado !== 'ENTREVISTA') {
      await prisma.postulacion.update({
        where: { id: postulacion.id },
        data: { estado: 'ENTREVISTA' }
      })

      // Buscar o crear entrevista grupal
      let entrevista = await prisma.entrevistaGrupal.findFirst({
        where: {
          vacanteId: postulacion.vacanteId,
          estado:    'PROGRAMADA',
        },
        include: { _count: { select: { invitaciones: true } } },
        orderBy: { fecha: 'asc' },
      })

      if (!entrevista || (entrevista as any)._count.invitaciones >= MAX_CANDIDATOS) {
        const fecha = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        entrevista = await prisma.entrevistaGrupal.create({
          data: {
            vacanteId:     postulacion.vacanteId,
            fecha,
            modalidad:     'PRESENCIAL',
            maxCandidatos: MAX_CANDIDATOS,
          },
          include: { _count: { select: { invitaciones: true } } },
        })
      }

      const expiresAt = new Date(entrevista.fecha.getTime() - HORAS_CONFIRMAR * 60 * 60 * 1000)

      // Verificar si ya tiene invitación
      const yaInvitado = await prisma.invitacionEntrevista.findFirst({
        where: { entrevistaId: entrevista.id, candidatoId }
      })

      if (!yaInvitado) {
        const invitacion = await prisma.invitacionEntrevista.create({
          data: { entrevistaId: entrevista.id, candidatoId, expiresAt },
        })

        // Enviar email
        const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '')
        const fechaStr = entrevista.fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        const horaStr = entrevista.fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

        const mail = emailEntrevista({
          nombre: `${postulacion.candidato.nombre} ${postulacion.candidato.apellido}`.trim(),
          vacante: postulacion.vacante.titulo,
          empresa: postulacion.vacante.empresa.nombre,
          fecha: fechaStr,
          hora: horaStr,
          modalidad: entrevista.modalidad,
          enlace: entrevista.enlace ?? undefined,
          direccion: entrevista.direccion ?? undefined,
          confirmUrl: `${base}/entrevistas/confirmar/${invitacion.tokenConfirm}`,
          expiresHoras: HORAS_CONFIRMAR,
        })

        await transporter.sendMail({ 
          from: process.env.MAIL_FROM, 
          to: postulacion.candidato.usuario.email, 
          ...mail 
        }).catch(console.error)

        resultados.push({
          vacanteId: postulacion.vacanteId,
          matchAnterior: postulacion.matchScore,
          matchNuevo: nuevoMatch,
          citacionGenerada: true
        })
      }
    } else {
      resultados.push({
        vacanteId: postulacion.vacanteId,
        matchAnterior: postulacion.matchScore,
        matchNuevo: nuevoMatch,
        citacionGenerada: false
      })
    }
  }

  return resultados
}
