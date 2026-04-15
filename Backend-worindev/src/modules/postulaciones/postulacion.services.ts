import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import { calcularMatchConVacante } from '../matching/matching.services'

const include = {
  vacante:   { include: { empresa: { select: { nombre: true, logoUrl: true } } } },
  candidato: { select: { nombre: true, apellido: true, matchScore: true, foto: true } },
}

export const listarPostulaciones = async (query: any, user: any) => {
  const { vacanteId, candidatoId, estado } = query

  // Candidato solo ve las suyas
  let filtroExtra: any = {}
  if (user.rol === 'CANDIDATO') {
    const c = await prisma.candidato.findFirst({ where: { usuarioId: user.id } })
    if (!c) return []
    filtroExtra.candidatoId = c.id
  }
  // Empresa solo ve las de sus vacantes
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

  const candidato = await prisma.candidato.findFirst({ where: { usuarioId: user.id } })
  if (!candidato) throw new AppError('Perfil de candidato no encontrado', 404)

  const vacante = await prisma.vacante.findUnique({ where: { id: Number(vacanteId) } })
  if (!vacante) throw new AppError('Vacante no encontrada', 404)
  if (vacante.estado !== 'ACTIVA') throw new AppError('Esta vacante no está activa', 409)

  const yaPostulado = await prisma.postulacion.findUnique({
    where: { vacanteId_candidatoId: { vacanteId: Number(vacanteId), candidatoId: candidato.id } }
  })
  if (yaPostulado) throw new AppError('Ya te postulaste a esta vacante', 409)

  // Calcular match score específico para esta vacante
  const matchScore = await calcularMatchConVacante(candidato.id, Number(vacanteId))

  const postulacion = await prisma.postulacion.create({
    data: { vacanteId: Number(vacanteId), candidatoId: candidato.id, matchScore },
    include,
  })

  return { message: 'Postulación enviada exitosamente', postulacion, matchScore }
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
