import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'
import { z } from 'zod'

const VacanteSchema = z.object({
  empresaId:      z.number().int().positive(),
  titulo:         z.string().trim().min(3).max(150),
  descripcion:    z.string().trim().min(10).max(3000),
  requisitos:     z.string().trim().min(10).max(2000),
  habilidades:    z.array(z.string().trim()).min(1, 'Debe agregar al menos una habilidad').max(20),
  ciudad:         z.string().trim().min(2).max(100),
  modalidad:      z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
  tipoContrato:   z.enum(['INDEFINIDO', 'FIJO', 'PRESTACION', 'PRACTICAS', 'TEMPORAL']),
  salarioMin:     z.number().int().min(0),
  salarioMax:     z.number().int().min(0),
  nivelEducacion: z.enum(['BACHILLER','TECNICO','TECNOLOGO','PROFESIONAL','ESPECIALIZACION','MAESTRIA','DOCTORADO']),
  anosExperiencia:z.number().int().min(0).max(30),
  // Requerimientos de tests
  requiereTestHardSkill:   z.boolean().default(false),
  puntajeMinHardSkill:     z.number().int().min(0).max(100).optional(),
  requiereTestSoftSkill:   z.boolean().default(false),
  puntajeMinSoftSkill:     z.number().int().min(0).max(100).optional(),
  requiereTestPsicometria: z.boolean().default(false),
  puntajeMinPsicometria:   z.number().int().min(0).max(100).optional(),
  requiereTestLogistica:   z.boolean().default(false),
  puntajeMinLogistica:     z.number().int().min(0).max(100).optional(),
  requiereReferencias:     z.boolean().default(false),
  minimoReferencias:       z.number().int().min(0).max(10).optional(),
})

const include = {
  empresa: { select: { nombre: true, logoUrl: true, ciudad: true, sector: true } },
  _count:  { select: { postulaciones: true } },
}

export const listarVacantes = async (query: any, soloActivas: boolean) => {
  const { buscar, ciudad, modalidad, empresaId, habilidad, page = 1, limit = 20 } = query
  const skip = (Number(page) - 1) * Number(limit)

  const where = {
    ...(soloActivas ? { estado: 'ACTIVA' as const } : {}),
    ...(buscar    ? { OR: [{ titulo: { contains: buscar, mode: 'insensitive' as const } }, { descripcion: { contains: buscar, mode: 'insensitive' as const } }] } : {}),
    ...(ciudad    ? { ciudad: { contains: ciudad, mode: 'insensitive' as const } } : {}),
    ...(modalidad ? { modalidad: modalidad as any } : {}),
    ...(empresaId ? { empresaId: Number(empresaId) } : {}),
    ...(habilidad ? { habilidades: { has: habilidad } } : {}),
  }

  const [vacantes, total] = await Promise.all([
    prisma.vacante.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.vacante.count({ where })
  ])

  return {
    vacantes,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  }
}

export const obtenerVacante = async (id: number) => {
  const v = await prisma.vacante.findUnique({
    where: { id },
    include: {
      ...include,
      postulaciones: {
        include: { candidato: { select: { nombre: true, apellido: true, matchScore: true } } },
        orderBy: { matchScore: 'desc' },
        take: 10,
      }
    }
  })
  if (!v) throw new AppError('Vacante no encontrada', 404)
  return v
}

export const crearVacante = async (data: any) => {
  const parsed = VacanteSchema.safeParse(data)
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? 'Datos inválidos', 400)

  const empresa = await prisma.empresa.findUnique({ where: { id: parsed.data.empresaId } })
  if (!empresa) throw new AppError('Empresa no encontrada', 404)

  if (parsed.data.salarioMin && parsed.data.salarioMax && parsed.data.salarioMin > parsed.data.salarioMax)
    throw new AppError('El salario mínimo no puede ser mayor al máximo', 400)

  const vacante = await prisma.vacante.create({ data: parsed.data, include })
  return { message: 'Vacante creada', vacante }
}

export const actualizarVacante = async (id: number, data: any) => {
  const existe = await prisma.vacante.findUnique({ where: { id } })
  if (!existe) throw new AppError('Vacante no encontrada', 404)

  const {
    titulo, descripcion, requisitos, habilidades, ciudad, modalidad,
    tipoContrato, salarioMin, salarioMax, nivelEducacion, anosExperiencia,
    requiereTestHardSkill, puntajeMinHardSkill,
    requiereTestSoftSkill, puntajeMinSoftSkill,
    requiereTestPsicometria, puntajeMinPsicometria,
    requiereTestLogistica, puntajeMinLogistica,
    requiereReferencias, minimoReferencias
  } = data

  const vacante = await prisma.vacante.update({
    where: { id },
    data: {
      ...(titulo          !== undefined && { titulo }),
      ...(descripcion     !== undefined && { descripcion }),
      ...(requisitos      !== undefined && { requisitos }),
      ...(habilidades     !== undefined && { habilidades }),
      ...(ciudad          !== undefined && { ciudad }),
      ...(modalidad       !== undefined && { modalidad }),
      ...(tipoContrato    !== undefined && { tipoContrato }),
      ...(salarioMin      !== undefined && { salarioMin: Number(salarioMin) }),
      ...(salarioMax      !== undefined && { salarioMax: Number(salarioMax) }),
      ...(nivelEducacion  !== undefined && { nivelEducacion }),
      ...(anosExperiencia !== undefined && { anosExperiencia: Number(anosExperiencia) }),
      ...(requiereTestHardSkill   !== undefined && { requiereTestHardSkill }),
      ...(puntajeMinHardSkill     !== undefined && { puntajeMinHardSkill: puntajeMinHardSkill ? Number(puntajeMinHardSkill) : null }),
      ...(requiereTestSoftSkill   !== undefined && { requiereTestSoftSkill }),
      ...(puntajeMinSoftSkill     !== undefined && { puntajeMinSoftSkill: puntajeMinSoftSkill ? Number(puntajeMinSoftSkill) : null }),
      ...(requiereTestPsicometria !== undefined && { requiereTestPsicometria }),
      ...(puntajeMinPsicometria   !== undefined && { puntajeMinPsicometria: puntajeMinPsicometria ? Number(puntajeMinPsicometria) : null }),
      ...(requiereTestLogistica   !== undefined && { requiereTestLogistica }),
      ...(puntajeMinLogistica     !== undefined && { puntajeMinLogistica: puntajeMinLogistica ? Number(puntajeMinLogistica) : null }),
      ...(requiereReferencias     !== undefined && { requiereReferencias }),
      ...(minimoReferencias       !== undefined && { minimoReferencias: minimoReferencias ? Number(minimoReferencias) : null }),
    },
    include,
  })
  return { message: 'Vacante actualizada', vacante }
}

export const cambiarEstadoVacante = async (id: number, estado: string) => {
  if (!['ACTIVA', 'PAUSADA', 'CERRADA'].includes(estado))
    throw new AppError('Estado inválido. Opciones: ACTIVA, PAUSADA, CERRADA', 400)

  const vacante = await prisma.vacante.update({ where: { id }, data: { estado: estado as any }, include })
  return { message: `Vacante ${estado.toLowerCase()}`, vacante }
}

export const eliminarVacante = async (id: number) => {
  const existe = await prisma.vacante.findUnique({ where: { id } })
  if (!existe) throw new AppError('Vacante no encontrada', 404)

  await prisma.vacante.delete({ where: { id } })
  return { message: 'Vacante eliminada' }
}
