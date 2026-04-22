import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import transporter from '../../config/mailer'
import { emailReferencia } from '../../utils/email.templates'
import { calcularMatchScore } from '../matching/matching.services'

// ─── LISTAR ───────────────────────────────────────────────────────────────────
export const listarCandidatos = async (query: any) => {
  const { buscar, ciudad, habilidad, minScore, page = 1, limit = 20 } = query
  const skip = (Number(page) - 1) * Number(limit)

  const where = {
    ...(buscar ? {
      OR: [
        { nombre:   { contains: buscar, mode: 'insensitive' as const } },
        { apellido: { contains: buscar, mode: 'insensitive' as const } },
        { usuario:  { email: { contains: buscar, mode: 'insensitive' as const } } },
      ]
    } : {}),
    ...(ciudad ? { ciudad: { contains: ciudad, mode: 'insensitive' as const } } : {}),
    ...(habilidad ? { habilidades: { some: { habilidad: { contains: habilidad, mode: 'insensitive' as const } } } } : {}),
    ...(minScore ? { matchScore: { gte: Number(minScore) } } : {}),
  }

  const [candidatos, total] = await Promise.all([
    prisma.candidato.findMany({
      where,
      include: {
        usuario:     { select: { email: true, estado: true } },
        habilidades: { take: 10 },
        _count:      { select: { postulaciones: true } },
      },
      orderBy: { matchScore: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.candidato.count({ where })
  ])

  return {
    candidatos,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  }
}

// ─── OBTENER ──────────────────────────────────────────────────────────────────
export const obtenerCandidato = async (id: number) => {
  const c = await prisma.candidato.findUnique({
    where: { id },
    include: {
      usuario:      { select: { email: true, estado: true, createdAt: true } },
      habilidades:  { take: 20 },
      experiencias: { orderBy: { fechaInicio: 'desc' }, take: 10 },
      educaciones:  { orderBy: { fechaInicio: 'desc' }, take: 10 },
      referencias:  { take: 5 },
      testResultados: { 
        include: { test: { select: { id: true, nombre: true, tipo: true } } },
        take: 10
      },
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
      habilidades:  { take: 20 },
      experiencias: { orderBy: { fechaInicio: 'desc' }, take: 10 },
      educaciones:  { orderBy: { fechaInicio: 'desc' }, take: 10 },
      referencias:  { take: 5 },
      testResultados: { 
        include: { test: { select: { id: true, nombre: true, tipo: true } } },
        take: 10
      },
      _count: { select: { postulaciones: true } },
    }
  })
  if (!c) throw new AppError('Perfil de candidato no encontrado', 404)
  return c
}

// ─── ACTUALIZAR ───────────────────────────────────────────────────────────────
export const actualizarCandidato = async (id: number, data: any) => {
  console.log('[actualizarCandidato] INICIO id:', id)
  console.log('[actualizarCandidato] data recibida:', JSON.stringify(data))
  const existe = await prisma.candidato.findUnique({ 
    where: { id },
    include: {
      experiencias: true,
      educaciones: true,
    }
  })
  if (!existe) throw new AppError('Candidato no encontrado', 404)

  const {
    nombre, apellido, telefono, ciudad, foto, cvUrl,
    nivelEducacion, tituloObtenido, anosExperiencia, pretensionSalarial,
    disponibilidad, modalidadPreferida, resumen, linkedinUrl, githubUrl
  } = data

  // Limpiar enums — convertir string vacío a undefined para que Prisma no falle
  const modalidad = modalidadPreferida && modalidadPreferida !== '' ? modalidadPreferida : undefined
  const nivelEduInput = nivelEducacion && nivelEducacion !== '' ? nivelEducacion : undefined

  // Calcular años de experiencia desde experiencias si no se proporciona
  let anosExp = anosExperiencia !== undefined ? Number(anosExperiencia) : undefined
  if (anosExp === undefined && existe.experiencias.length > 0) {
    let total = 0
    existe.experiencias.forEach(exp => {
      const inicio = new Date(exp.fechaInicio)
      const fin = exp.actual ? new Date() : new Date(exp.fechaFin!)
      const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      total += Math.max(0, anos)
    })
    anosExp = Math.round(total * 10) / 10
  }

  // Obtener nivel más alto de educación desde educaciones si no se proporciona
  let nivelEdu = nivelEduInput
  if (!nivelEdu && existe.educaciones.length > 0) {
    const nivelesOrden: Record<string, number> = {
      'CURSO': 0, 'BACHILLER': 1, 'TECNICO': 2, 'TECNOLOGO': 3, 'PROFESIONAL': 4,
      'ESPECIALIZACION': 5, 'MAESTRIA': 6, 'DOCTORADO': 7,
    }
    let maxNivel = 0
    existe.educaciones.forEach(edu => {
      const nivel = nivelesOrden[edu.nivel] || 0
      if (nivel > maxNivel) {
        maxNivel = nivel
        nivelEdu = edu.nivel
      }
    })
  }

  // Obtener títulos desde educaciones si no se proporciona
  let titulos = tituloObtenido
  if (!titulos && existe.educaciones.length > 0) {
    titulos = existe.educaciones.map(e => e.titulo).filter(t => t).join(', ')
  }

  const actualizado = await prisma.candidato.update({
    where: { id },
    data: {
      ...(nombre             !== undefined && { nombre }),
      ...(apellido           !== undefined && { apellido }),
      ...(telefono           !== undefined && { telefono }),
      ...(ciudad             !== undefined && { ciudad }),
      ...(foto               !== undefined && { foto }),
      ...(cvUrl              !== undefined && { cvUrl }),
      ...(nivelEdu           !== undefined && { nivelEducacion: nivelEdu }),
      ...(titulos            !== undefined && { tituloObtenido: titulos }),
      ...(anosExp            !== undefined && { anosExperiencia: anosExp }),
      ...(pretensionSalarial !== undefined && pretensionSalarial !== null && { pretensionSalarial: Math.round(Number(pretensionSalarial)) }),
      ...(pretensionSalarial === null && { pretensionSalarial: null }),
      ...(disponibilidad     !== undefined && { disponibilidad }),
      ...(modalidad          !== undefined && { modalidadPreferida: modalidad }),
      ...(resumen            !== undefined && { resumen }),
      ...(linkedinUrl        !== undefined && { linkedinUrl }),
      ...(githubUrl          !== undefined && { githubUrl }),
    }
  }).catch((err: any) => {
    console.error('[Prisma update candidato]', err.message)
    throw err
  })

  // Recalcular match score y generar citaciones si alcanza 93%
  calcularMatchScore(id).then(async nuevoScore => {
    await prisma.candidato.update({ where: { id }, data: { matchScore: nuevoScore } })
    const { recalcularMatchPostulaciones } = await import('../postulaciones/postulacion.services')
    await recalcularMatchPostulaciones(id)
  }).catch(console.error)

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

    // Recalcular score y generar citaciones si alcanza 93%
    calcularMatchScore(candidatoId).then(async score => {
      await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })
      const { recalcularMatchPostulaciones } = await import('../postulaciones/postulacion.services')
      await recalcularMatchPostulaciones(candidatoId)
    }).catch(console.error)

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

    // Recalcular años de experiencia desde todas las experiencias
    const experiencias = await prisma.experiencia.findMany({ where: { candidatoId } })
    let totalAnos = 0
    experiencias.forEach(e => {
      const inicio = new Date(e.fechaInicio)
      const fin = e.actual ? new Date() : new Date(e.fechaFin!)
      const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      totalAnos += Math.max(0, anos)
    })
    await prisma.candidato.update({
      where: { id: candidatoId },
      data: { anosExperiencia: Math.round(totalAnos * 10) / 10 }
    })

    // Recalcular score y generar citaciones si alcanza 93%
    calcularMatchScore(candidatoId).then(async score => {
      await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })
      const { recalcularMatchPostulaciones } = await import('../postulaciones/postulacion.services')
      await recalcularMatchPostulaciones(candidatoId)
    }).catch(console.error)

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

    // Recalcular años de experiencia desde todas las experiencias
    const experiencias = await prisma.experiencia.findMany({ where: { candidatoId } })
    let totalAnos = 0
    experiencias.forEach(e => {
      const inicio = new Date(e.fechaInicio)
      const fin = e.actual ? new Date() : new Date(e.fechaFin!)
      const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      totalAnos += Math.max(0, anos)
    })
    await prisma.candidato.update({
      where: { id: candidatoId },
      data: { anosExperiencia: Math.round(totalAnos * 10) / 10 }
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

  // Recalcular años de experiencia desde todas las experiencias restantes
  const experiencias = await prisma.experiencia.findMany({ where: { candidatoId } })
  let totalAnos = 0
  experiencias.forEach(exp => {
    const inicio = new Date(exp.fechaInicio)
    const fin = exp.actual ? new Date() : new Date(exp.fechaFin!)
    const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    totalAnos += Math.max(0, anos)
  })
  await prisma.candidato.update({
    where: { id: candidatoId },
    data: { anosExperiencia: Math.round(totalAnos * 10) / 10 }
  })

  return { message: 'Experiencia eliminada' }
}

// ─── EDUCACIÓN ────────────────────────────────────────────────────────────────
export const agregarEducacion = async (candidatoId: number, data: any) => {
  if (!data.institucion || !data.titulo || !data.nivel || !data.fechaInicio)
    throw new AppError('Institución, título, nivel y fecha de inicio son requeridos', 400)

  const nivelesValidos = ['CURSO', 'BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO']
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

    // Recalcular nivel más alto y títulos desde todas las educaciones
    const educaciones = await prisma.educacion.findMany({ where: { candidatoId } })
    const nivelesOrden: Record<string, number> = {
      'CURSO': 0, 'BACHILLER': 1, 'TECNICO': 2, 'TECNOLOGO': 3, 'PROFESIONAL': 4,
      'ESPECIALIZACION': 5, 'MAESTRIA': 6, 'DOCTORADO': 7,
    }
    let nivelMasAlto = ''
    let maxNivel = 0
    educaciones.forEach(e => {
      const nivel = nivelesOrden[e.nivel] || 0
      if (nivel > maxNivel) {
        maxNivel = nivel
        nivelMasAlto = e.nivel
      }
    })
    const titulos = educaciones.map(e => e.titulo).filter(t => t).join(', ')
    
    await prisma.candidato.update({
      where: { id: candidatoId },
      data: { 
        nivelEducacion: nivelMasAlto as any,
        tituloObtenido: titulos
      }
    })

    // Recalcular score y generar citaciones si alcanza 93%
    calcularMatchScore(candidatoId).then(async score => {
      await prisma.candidato.update({ where: { id: candidatoId }, data: { matchScore: score } })
      const { recalcularMatchPostulaciones } = await import('../postulaciones/postulacion.services')
      await recalcularMatchPostulaciones(candidatoId)
    }).catch(console.error)

    return edu
  } catch (error: any) {
    console.error('Error al crear educación:', error)
    throw new AppError(error.message || 'Error al guardar educación', 400)
  }
}

export const actualizarEducacion = async (candidatoId: number, eduId: number, data: any) => {
  if (!data.institucion || !data.titulo || !data.nivel || !data.fechaInicio)
    throw new AppError('Institución, título, nivel y fecha de inicio son requeridos', 400)

  const nivelesValidos = ['CURSO', 'BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO']
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

    // Recalcular nivel más alto y títulos desde todas las educaciones
    const educaciones = await prisma.educacion.findMany({ where: { candidatoId } })
    const nivelesOrden: Record<string, number> = {
      'CURSO': 0, 'BACHILLER': 1, 'TECNICO': 2, 'TECNOLOGO': 3, 'PROFESIONAL': 4,
      'ESPECIALIZACION': 5, 'MAESTRIA': 6, 'DOCTORADO': 7,
    }
    let nivelMasAlto = ''
    let maxNivel = 0
    educaciones.forEach(e => {
      const nivel = nivelesOrden[e.nivel] || 0
      if (nivel > maxNivel) {
        maxNivel = nivel
        nivelMasAlto = e.nivel
      }
    })
    const titulos = educaciones.map(e => e.titulo).filter(t => t).join(', ')
    
    await prisma.candidato.update({
      where: { id: candidatoId },
      data: { 
        nivelEducacion: nivelMasAlto as any,
        tituloObtenido: titulos
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

  // Recalcular nivel más alto y títulos desde todas las educaciones restantes
  const educaciones = await prisma.educacion.findMany({ where: { candidatoId } })
  const nivelesOrden: Record<string, number> = {
    'CURSO': 0, 'BACHILLER': 1, 'TECNICO': 2, 'TECNOLOGO': 3, 'PROFESIONAL': 4,
    'ESPECIALIZACION': 5, 'MAESTRIA': 6, 'DOCTORADO': 7,
  }
  let nivelMasAlto = ''
  let maxNivel = 0
  educaciones.forEach(edu => {
    const nivel = nivelesOrden[edu.nivel] || 0
    if (nivel > maxNivel) {
      maxNivel = nivel
      nivelMasAlto = edu.nivel
    }
  })
  const titulos = educaciones.map(edu => edu.titulo).filter(t => t).join(', ')
  
  await prisma.candidato.update({
    where: { id: candidatoId },
    data: { 
      nivelEducacion: nivelMasAlto ? (nivelMasAlto as any) : null,
      tituloObtenido: titulos || null
    }
  })

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

  // Recalcular score y generar citaciones si alcanza 93%
  calcularMatchScore(ref.candidatoId).then(async score => {
    await prisma.candidato.update({ where: { id: ref.candidatoId }, data: { matchScore: score } })
    const { recalcularMatchPostulaciones } = await import('../postulaciones/postulacion.services')
    await recalcularMatchPostulaciones(ref.candidatoId)
  }).catch(console.error)

  return { message: 'Referencia verificada exitosamente' }
}

// La empresa verifica manualmente las referencias durante/después de la entrevista
export const verificarReferenciaEmpresa = async (candidatoId: number, refId: number) => {
  const ref = await prisma.referencia.findFirst({ where: { id: refId, candidatoId } })
  if (!ref) throw new AppError('Referencia no encontrada', 404)

  const updated = await prisma.referencia.update({
    where: { id: refId },
    data: { verificado: !ref.verificado },
  })

  return { 
    message: updated.verificado ? 'Referencia marcada como verificada' : 'Verificación removida',
    referencia: updated 
  }
}
