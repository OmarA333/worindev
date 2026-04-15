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

export const obtenerCandidatoActual = async (user: any) => {
  const c = await prisma.candidato.findUnique({
    where: { usuarioId: user.id },
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
  if (!c) throw new AppError('Perfil de candidato no encontrado', 404)
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

export const subirCV = async (id: number, file: Express.Multer.File | undefined) => {
  if (!file) throw new AppError('No se proporcionó archivo', 400)

  const candidato = await prisma.candidato.findUnique({ where: { id } })
  if (!candidato) throw new AppError('Candidato no encontrado', 404)

  const cvUrl = `/uploads/${file.filename}`
  const actualizado = await prisma.candidato.update({
    where: { id },
    data: { cvUrl }
  })

  return { message: 'CV subido exitosamente', candidato: actualizado, cvUrl }
}

// ─── HABILIDADES ──────────────────────────────────────────────────────────────
export const agregarHabilidad = async (candidatoId: number, data: { habilidad: string; nivel?: string }) => {
  if (!data.habilidad?.trim()) throw new AppError('La habilidad es requerida', 400)

  try {
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
  } catch (error: any) {
    console.error('Error al crear habilidad:', error)
    throw new AppError(error.message || 'Error al guardar habilidad', 400)
  }
}

export const actualizarHabilidad = async (candidatoId: number, habId: number, data: { habilidad: string; nivel?: string }) => {
  if (!data.habilidad?.trim()) throw new AppError('La habilidad es requerida', 400)

  try {
    const h = await prisma.candidatoHabilidad.update({
      where: { id: habId },
      data: { habilidad: data.habilidad.trim(), nivel: data.nivel ?? 'Intermedio' }
    })
    return h
  } catch (error: any) {
    console.error('Error al actualizar habilidad:', error)
    throw new AppError(error.message || 'Error al actualizar habilidad', 400)
  }
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

  try {
    const exp = await prisma.experiencia.create({
      data: {
        candidatoId,
        empresa:     data.empresa.trim(),
        cargo:       data.cargo.trim(),
        descripcion: data.descripcion?.trim() ?? null,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
        actual:      data.actual ?? false,
        archivoUrl:  data.archivoUrl ?? null,
      }
    })

    const score = await calcularMatchScore(candidatoId)
    await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })

    return exp
  } catch (error: any) {
    console.error('Error al crear experiencia:', error)
    throw new AppError(error.message || 'Error al guardar experiencia', 400)
  }
}

export const actualizarExperiencia = async (candidatoId: number, expId: number, data: any) => {
  if (!data.empresa || !data.cargo || !data.fechaInicio)
    throw new AppError('Empresa, cargo y fecha de inicio son requeridos', 400)

  try {
    const exp = await prisma.experiencia.update({
      where: { id: expId },
      data: {
        empresa:     data.empresa.trim(),
        cargo:       data.cargo.trim(),
        descripcion: data.descripcion?.trim() ?? null,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
        actual:      data.actual ?? false,
        archivoUrl:  data.archivoUrl ?? null,
      }
    })
    return exp
  } catch (error: any) {
    console.error('Error al actualizar experiencia:', error)
    throw new AppError(error.message || 'Error al actualizar experiencia', 400)
  }
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

  const nivelesValidos = ['BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO']
  if (!nivelesValidos.includes(data.nivel))
    throw new AppError(`Nivel de educación inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`, 400)

  try {
    const edu = await prisma.educacion.create({
      data: {
        candidatoId,
        institucion: data.institucion.trim(),
        titulo:      data.titulo.trim(),
        nivel:       data.nivel as any,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
        actual:      data.actual ?? false,
        archivoUrl:  data.archivoUrl ?? null,
      }
    })

    const score = await calcularMatchScore(candidatoId)
    await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })

    return edu
  } catch (error: any) {
    console.error('Error al crear educación:', error)
    throw new AppError(error.message || 'Error al guardar educación', 400)
  }
}

export const actualizarEducacion = async (candidatoId: number, eduId: number, data: any) => {
  if (!data.institucion || !data.titulo || !data.nivel || !data.fechaInicio)
    throw new AppError('Institución, título, nivel y fecha de inicio son requeridos', 400)

  const nivelesValidos = ['BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO']
  if (!nivelesValidos.includes(data.nivel))
    throw new AppError(`Nivel de educación inválido. Debe ser uno de: ${nivelesValidos.join(', ')}`, 400)

  try {
    const edu = await prisma.educacion.update({
      where: { id: eduId },
      data: {
        institucion: data.institucion.trim(),
        titulo:      data.titulo.trim(),
        nivel:       data.nivel as any,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin:    data.fechaFin ? new Date(data.fechaFin) : null,
        actual:      data.actual ?? false,
        archivoUrl:  data.archivoUrl ?? null,
      }
    })
    return edu
  } catch (error: any) {
    console.error('Error al actualizar educación:', error)
    throw new AppError(error.message || 'Error al actualizar educación', 400)
  }
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

  try {
    const ref = await prisma.referencia.create({
      data: {
        candidatoId,
        nombre:   data.nombre.trim(),
        cargo:    data.cargo.trim(),
        empresa:  data.empresa.trim(),
        email:    data.email.trim().toLowerCase(),
        telefono: data.telefono?.trim() ?? null,
        archivoUrl: data.archivoUrl ?? null,
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
  } catch (error: any) {
    console.error('Error al crear referencia:', error)
    throw new AppError(error.message || 'Error al guardar referencia', 400)
  }
}

export const actualizarReferencia = async (candidatoId: number, refId: number, data: any) => {
  if (!data.nombre || !data.cargo || !data.empresa || !data.email)
    throw new AppError('Nombre, cargo, empresa y email son requeridos', 400)

  try {
    const ref = await prisma.referencia.update({
      where: { id: refId },
      data: {
        nombre:   data.nombre.trim(),
        cargo:    data.cargo.trim(),
        empresa:  data.empresa.trim(),
        email:    data.email.trim().toLowerCase(),
        telefono: data.telefono?.trim() ?? null,
        archivoUrl: data.archivoUrl ?? null,
      }
    })
    return ref
  } catch (error: any) {
    console.error('Error al actualizar referencia:', error)
    throw new AppError(error.message || 'Error al actualizar referencia', 400)
  }
}

export const eliminarReferencia = async (candidatoId: number, refId: number) => {
  const r = await prisma.referencia.findFirst({ where: { id: refId, candidatoId } })
  if (!r) throw new AppError('Referencia no encontrada', 404)
  await prisma.referencia.delete({ where: { id: refId } })
  return { message: 'Referencia eliminada' }
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
