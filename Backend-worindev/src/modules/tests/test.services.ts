import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import { calcularMatchScore } from '../matching/matching.services'

export const listarTests = async () =>
  prisma.test.findMany({ where: { activo: true }, include: { _count: { select: { preguntas: true } } }, orderBy: { tipo: 'asc' } })

export const debugTests = async () => {
  const todos = await prisma.test.findMany({ include: { _count: { select: { preguntas: true } } } })
  const activos = await prisma.test.findMany({ where: { activo: true }, include: { _count: { select: { preguntas: true } } } })
  return { total: todos.length, activos: activos.length, todos, activos }
}

export const crearPregunta = async (testId: number, data: any) => {
  const { texto, tipo, opciones, orden } = data
  if (!texto || !tipo) throw new AppError('texto y tipo son requeridos', 400)

  const test = await prisma.test.findUnique({ where: { id: testId } })
  if (!test) throw new AppError('Test no encontrado', 404)

  const pregunta = await prisma.pregunta.create({
    data: {
      testId,
      texto,
      tipo: tipo ?? 'OPCION_MULTIPLE',
      opciones: opciones ?? null,
      orden: orden ?? 0,
    }
  })

  return { message: 'Pregunta creada', pregunta }
}

export const obtenerTest = async (id: number) => {
  const t = await prisma.test.findUnique({ where: { id }, include: { preguntas: { orderBy: { orden: 'asc' } } } })
  if (!t) throw new AppError('Test no encontrado', 404)
  return t
}

export const crearTest = async (data: any) => {
  const { nombre, tipo, descripcion, duracion, peso, preguntas } = data
  if (!nombre || !tipo || !duracion || peso === undefined)
    throw new AppError('nombre, tipo, duracion y peso son requeridos', 400)

  const test = await prisma.$transaction(async (tx) => {
    const t = await tx.test.create({ data: { nombre, tipo, descripcion, duracion: Number(duracion), peso: Number(peso) } })
    if (preguntas?.length) {
      await tx.pregunta.createMany({
        data: preguntas.map((p: any, i: number) => ({
          testId:  t.id,
          texto:   p.texto,
          tipo:    p.tipo ?? 'OPCION_MULTIPLE',
          opciones:p.opciones ?? null,
          orden:   i,
        }))
      })
    }
    return t
  })
  return { message: 'Test creado', test }
}

export const actualizarTest = async (id: number, data: any) => {
  const existe = await prisma.test.findUnique({ where: { id } })
  if (!existe) throw new AppError('Test no encontrado', 404)

  const { nombre, descripcion, duracion, peso, activo } = data
  const test = await prisma.test.update({
    where: { id },
    data: {
      ...(nombre      !== undefined && { nombre }),
      ...(descripcion !== undefined && { descripcion }),
      ...(duracion    !== undefined && { duracion: Number(duracion) }),
      ...(peso        !== undefined && { peso: Number(peso) }),
      ...(activo      !== undefined && { activo }),
    }
  })
  return { message: 'Test actualizado', test }
}

export const responderTest = async (testId: number, data: any, user: any) => {
  const { respuestas, puntaje } = data

  if (puntaje === undefined || puntaje < 0 || puntaje > 100)
    throw new AppError('puntaje debe ser un número entre 0 y 100', 400)

  const test = await prisma.test.findUnique({ where: { id: testId } })
  if (!test) throw new AppError('Test no encontrado', 404)

  const candidato = await prisma.candidato.findFirst({ where: { usuarioId: user.id } })
  if (!candidato) throw new AppError('Perfil de candidato no encontrado', 404)

  // Upsert resultado
  const resultado = await prisma.testResultado.upsert({
    where:  { candidatoId_testId: { candidatoId: candidato.id, testId } },
    update: { puntaje: Number(puntaje), respuestas: respuestas ?? null, completadoAt: new Date() },
    create: { candidatoId: candidato.id, testId, puntaje: Number(puntaje), respuestas: respuestas ?? null },
  })

  // Recalcular match score
  const nuevoScore = await calcularMatchScore(candidato.id)
  await prisma.candidato.update({ where: { id: candidato.id }, data: { matchScore: nuevoScore } })

  return { message: 'Test completado', resultado, nuevoMatchScore: nuevoScore }
}

export const resultadosCandidato = async (candidatoId: number) => {
  const resultados = await prisma.testResultado.findMany({
    where:   { candidatoId },
    include: { test: true },
    orderBy: { completadoAt: 'desc' },
  })
  return resultados
}
