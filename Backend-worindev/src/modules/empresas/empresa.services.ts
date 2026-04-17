import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'

const include = {
  usuario:  { select: { email: true, estado: true } },
  _count:   { select: { vacantes: true } },
}

export const listarEmpresas = async (query: any, soloVerificadas: boolean) => {
  const { buscar, sector } = query
  return prisma.empresa.findMany({
    where: {
      ...(soloVerificadas ? { verificada: true } : {}),
      ...(buscar  ? { nombre: { contains: buscar, mode: 'insensitive' } } : {}),
      ...(sector  ? { sector: { contains: sector, mode: 'insensitive' } } : {}),
    },
    include,
    orderBy: { createdAt: 'desc' },
  })
}

export const obtenerEmpresa = async (id: number) => {
  const e = await prisma.empresa.findUnique({
    where: { id },
    include: {
      ...include,
      vacantes: { where: { estado: 'ACTIVA' }, orderBy: { createdAt: 'desc' }, take: 5 }
    }
  })
  if (!e) throw new AppError('Empresa no encontrada', 404)
  return e
}

export const obtenerEmpresaActual = async (user: any) => {
  const e = await prisma.empresa.findUnique({
    where: { usuarioId: user.id },
    include: {
      ...include,
      vacantes: { where: { estado: 'ACTIVA' }, orderBy: { createdAt: 'desc' }, take: 5 }
    }
  })
  if (!e) throw new AppError('Perfil de empresa no encontrado', 404)
  return e
}

export const actualizarEmpresa = async (id: number, data: any) => {
  const existe = await prisma.empresa.findUnique({ where: { id } })
  if (!existe) throw new AppError('Empresa no encontrada', 404)

  const { nombre, sector, tamano, ciudad, descripcion, logoUrl, sitioWeb, cultura } = data
  const empresa = await prisma.empresa.update({
    where: { id },
    data: {
      ...(nombre      !== undefined && { nombre }),
      ...(sector      !== undefined && { sector }),
      ...(tamano      !== undefined && { tamano }),
      ...(ciudad      !== undefined && { ciudad }),
      ...(descripcion !== undefined && { descripcion }),
      ...(logoUrl     !== undefined && { logoUrl }),
      ...(sitioWeb    !== undefined && { sitioWeb }),
      ...(cultura     !== undefined && { cultura }),
    },
    include,
  })
  return { message: 'Empresa actualizada', empresa }
}

export const verificarEmpresa = async (id: number) => {
  const e = await prisma.empresa.findUnique({ where: { id } })
  if (!e) throw new AppError('Empresa no encontrada', 404)

  const empresa = await prisma.empresa.update({ where: { id }, data: { verificada: !e.verificada }, include })
  return { message: `Empresa ${empresa.verificada ? 'verificada' : 'desverificada'}`, empresa }
}
