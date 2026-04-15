import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import transporter from '../../config/mailer'
import { emailReferencia } from '../../utils/email.templates'
import { calcularMatchScore } from '../matching/matching.services'

// ─── LISTAR ───────────────────────────────────────────────────────────────────
export const listarCandidatos = async (query: any) => {
  const { buscar, ciudad, habilidad, minScore } = query

  const candidatos = await prisma.candidato.findMany({
    where: {
      ...(buscar ? {
        OR: [
          { nombre:   { contains: buscar, mode: 'insensitive' } },
          { apellido: { contains: buscar, mode: 'insensitive' } },
          { usuario:  { email: { contains: buscar, mode: 'insensitive' } } },
        ]
      } : {}),
      ...(ciudad ? { ciudad: { contains: ciudad, mode: 'insensitive' } } : {}),
      ...(habilidad ? { habilidades: { some: { habilidad: { contains: habilidad, mode: 'insensitive' } } } } : {}),
      ...(minScore ? { matchScore: { gte: Number(minScore) } } : {}),
    },
    include: {
      usuario:     { select: { email: true, estado: true } },
      habilidades: true,
      _count:      { select: { postulaciones: true } },
    },
    orderBy: { matchScore: 'desc' },
  })

  return candidatos
}

// ─── OBTENER ──────────────────────────────────────────────────────────────────
export const obtenerCandidato = async (id: number) => {
  const c = await prisma.candidato.findUnique({
    where: { id },
    include: {
      usuario:      { select: { email: true, estado: true, createdAt: true } },
      habilidades:  true,
      experiencias: { orderBy: { fechaInicio: 'desc' } },
      educaciones:  { orderBy: { fechaInicio: 'desc' } },
      referencias:  true,
      testResultados: { include: { test: true } },
      _count: { select: { postulaciones: true } },
    }
  })
  if (!c) throw new AppError('Candidato no encontrado', 404)
  return c
}

// ─── ACTUALIZAR ───────────────────────────────────────────────────────────────
export const actualizarCandidato = async (id: number, data: any) => {
  const existe = await prisma.candidato.findUnique({ where: { id } })
  if (!existe) throw new AppError('Candidato no encontrado', 404)

  const {
    nombre, apellido, telefono, ciudad, departamento, foto, cvUrl,
    nivelEducacion, tituloObtenido, anosExperiencia, pretensionSalarial,
    disponibilidad, modalidadPreferida, resumen, linkedinUrl, githubUrl
  } = data

  const actualizado = await prisma.candidato.update({
    where: { id },
    data: {
      ...(nombre             !== undefined && { nombre }),
      ...(apellido           !== undefined && { apellido }),
      ...(telefono           !== undefined && { telefono }),
      ...(ciudad             !== undefined && { ciudad }),
      ...(departamento       !== undefined && { departamento }),
      ...(foto               !== undefined && { foto }),
      ...(cvUrl              !== undefined && { cvUrl }),
      ...(nivelEducacion     !== undefined && { nivelEducacion }),
      ...(tituloObtenido     !== undefined && { tituloObtenido }),
      ...(anosExperiencia    !== undefined && { anosExperiencia: Number(anosExperiencia) }),
      ...(pretensionSalarial !== undefined && { pretensionSalarial: Number(pretensionSalarial) }),
      ...(disponibilidad     !== undefined && { disponibilidad }),
      ...(modalidadPreferida !== undefined && { modalidadPreferida }),
      ...(resumen            !== undefined && { resumen }),
      ...(linkedinUrl        !== undefined && { linkedinUrl }),
      ...(githubUrl          !== undefined && { githubUrl }),
    }
  })

  // Recalcular match score
  const nuevoScore = await calcularMatchScore(id)
  await prisma.candidato.update({ where: { id }, data: { matchScore: nuevoScore } })

  return { message: 'Perfil actualizado', candidato: actualizado }
}

// ─── HABILIDADES ──────────────────────────────────────────────────────────────
export const agregarHabilidad = async (candidatoId: number, data: { habilidad: string; nivel?: string }) => {
  if (!data.habilidad?.trim()) throw new AppError('La habilidad es requerida', 400)

  const existe = await prisma.candidatoHabilidad.findUnique({
    where: { candidatoId_habilidad: { candidatoId, habilidad: data.habilidad.trim() } }
  })
  if (existe) throw new AppError('Ya tienes esa habilidad registrada', 409)

  const h = await prisma.candidatoHabilidad.create({
    data: { candidatoId, habilidad: data.habilidad.trim(), nivel: data.nivel ?? 'Intermedio' }
  })

  const score = await calcularMatchScore(candidatoId)
  await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })

  return h
}

export const eliminarHabilidad = async (candidatoId: number, habilidadId: number) => {
  const h = await prisma.candidatoHabilidad.findFirst({ where: { id: habilidadId, candidatoId } })
  if (!h) throw new AppError('Habilidad no encontrada', 404)
  await prisma.candidatoHabilidad.delete({ where: { id: habilidadId } })
  return { message: 'Habilidad eliminada' }
}

// ─── EXPERIENCIA ──────────────────────────────────────────────────────────────
export const agregarExperiencia = async (candidatoId: number, data: any) => {
  if (!data.empresa || !data.cargo || !data.fechaInicio)
    throw new AppError('Empresa, cargo y fecha de inicio son requeridos', 400)

  const exp = await prisma.experiencia.create({
    data: {
      candidatoId,
      empresa:     data.empresa,
      cargo:       data.cargo,
      descripcion: data.descripcion ?? null,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
      actual:      data.actual ?? false,
    }
  })

  const score = await calcularMatchScore(candidatoId)
  await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })

  return exp
}

export const eliminarExperiencia = async (candidatoId: number, expId: number) => {
  const e = await prisma.experiencia.findFirst({ where: { id: expId, candidatoId } })
  if (!e) throw new AppError('Experiencia no encontrada', 404)
  await prisma.experiencia.delete({ where: { id: expId } })
  return { message: 'Experiencia eliminada' }
}

// ─── EDUCACIÓN ────────────────────────────────────────────────────────────────
export const agregarEducacion = async (candidatoId: number, data: any) => {
  if (!data.institucion || !data.titulo || !data.nivel || !data.fechaInicio)
    throw new AppError('Institución, título, nivel y fecha de inicio son requeridos', 400)

  const edu = await prisma.educacion.create({
    data: {
      candidatoId,
      institucion: data.institucion,
      titulo:      data.titulo,
      nivel:       data.nivel,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
      actual:      data.actual ?? false,
    }
  })

  const score = await calcularMatchScore(candidatoId)
  await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })

  return edu
}

export const eliminarEducacion = async (candidatoId: number, eduId: number) => {
  const e = await prisma.educacion.findFirst({ where: { id: eduId, candidatoId } })
  if (!e) throw new AppError('Educación no encontrada', 404)
  await prisma.educacion.delete({ where: { id: eduId } })
  return { message: 'Educación eliminada' }
}

// ─── REFERENCIAS ──────────────────────────────────────────────────────────────
export const agregarReferencia = async (candidatoId: number, data: any) => {
  if (!data.nombre || !data.cargo || !data.empresa || !data.email)
    throw new AppError('Nombre, cargo, empresa y email son requeridos', 400)

  const ref = await prisma.referencia.create({
    data: {
      candidatoId,
      nombre:   data.nombre,
      cargo:    data.cargo,
      empresa:  data.empresa,
      email:    data.email,
      telefono: data.telefono ?? null,
    }
  })

  // Generar token de verificación y enviar email
  const token = require('crypto').randomUUID()
  await prisma.referencia.update({ where: { id: ref.id }, data: { tokenVerif: token } })

  const candidato = await prisma.candidato.findUnique({ where: { id: candidatoId } })
  const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '')
  const mail = emailReferencia({
    nombreCandidato: `${candidato?.nombre} ${candidato?.apellido}`.trim(),
    cargo:           data.cargo,
    empresa:         data.empresa,
    verificarUrl:    `${base}/referencias/verificar/${token}`,
  })
  await transporter.sendMail({ from: process.env.MAIL_FROM, to: data.email, ...mail }).catch(console.error)

  return { message: 'Referencia agregada. Se envió email de verificación.', referencia: ref }
}

export const verificarReferencia = async (token: string) => {
  const ref = await prisma.referencia.findUnique({ where: { tokenVerif: token } })
  if (!ref) throw new AppError('Token de verificación inválido', 400)
  if (ref.verificado) return { message: 'Esta referencia ya fue verificada' }

  await prisma.referencia.update({ where: { id: ref.id }, data: { verificado: true } })

  // Recalcular score
  const score = await calcularMatchScore(ref.candidatoId)
  await prisma.candidato.update({ where: { id: ref.candidatoId }, data: { matchScore: score } })

  return { message: 'Referencia verificada exitosamente' }
}
