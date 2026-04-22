import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'

const include = {
  candidato: { select: { id: true, nombre: true, apellido: true, matchScore: true } },
  empresa:   { select: { id: true, nombre: true, verificada: true } },
}

export const listarUsuarios = async (query: any) => {
  const { rol, estado, buscar } = query
  return prisma.usuario.findMany({
    where: {
      ...(rol    ? { rol: rol as any }       : {}),
      ...(estado ? { estado: estado as any } : {}),
      ...(buscar ? { email: { contains: buscar, mode: 'insensitive' as const } } : {}),
    },
    include,
    orderBy: { createdAt: 'desc' },
  })
}

export const obtenerUsuario = async (id: number) => {
  const u = await prisma.usuario.findUnique({ where: { id }, include })
  if (!u) throw new AppError('Usuario no encontrado', 404)
  return u
}

export const cambiarEstado = async (id: number, estado: string) => {
  const estados = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO']
  if (!estados.includes(estado)) throw new AppError(`Estado inválido. Opciones: ${estados.join(', ')}`, 400)

  const u = await prisma.usuario.update({ where: { id }, data: { estado: estado as any }, include })
  return { message: 'Estado actualizado', usuario: u }
}

export const eliminarUsuario = async (id: number) => {
  const u = await prisma.usuario.findUnique({ where: { id } })
  if (!u) throw new AppError('Usuario no encontrado', 404)
  await prisma.usuario.delete({ where: { id } })
  return { message: 'Usuario eliminado' }
}

export const actualizarPerfil = async (usuarioId: number, data: any) => {
  const u = await prisma.usuario.findUnique({ where: { id: usuarioId }, include })
  if (!u) throw new AppError('Usuario no encontrado', 404)

  // Delegar al servicio correspondiente
  if (u.candidato) {
    const { actualizarCandidato } = await import('../candidatos/candidato.services')
    return actualizarCandidato(u.candidato.id, data)
  }
  if (u.empresa) {
    const { actualizarEmpresa } = await import('../empresas/empresa.services')
    return actualizarEmpresa(u.empresa.id, data)
  }
  throw new AppError('Perfil no encontrado', 404)
}
