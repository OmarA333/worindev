import prisma from '../../config/prisma'
import type { PerfilResponse, ActualizarPerfilDatos } from '../../types/interfaces'





// ── Helpers para errores con status ──────────────────────────────────────────

class AppError extends Error {
status: number
constructor(message: string, status: number) {
    super(message)
    this.status = status
}
}

// ── obtenerPerfil ─────────────────────────────────────────────────────────────

export const obtenerPerfil = async (usuarioId: number): Promise<PerfilResponse> => {
const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
    id:        true,
    email:     true,
    createdAt: true,
    rol: true,
    candidato: {
    select: {
    id:                  true,
    apellido:            true,
    telefono:            true,
    ciudad:              true,
    foto:                true,
        }
    },
    empresa: {
    select: {
    id:                  true,
    nombre:              true,
    rut:                 true,
    logoUrl:             true,
    ciudad:              true,
        }
    }
    }
})

if (!usuario) throw new AppError('Usuario no encontrado', 404)

// Determinar si es candidato o empresa
if (usuario.candidato) {
    return {
    id:                  usuario.id,
    nombre:              'Candidato', // No se guarda el nombre en Usuario
    email:               usuario.email,
    rol:                 usuario.rol ?? 'CANDIDATO',
    apellido:            usuario.candidato.apellido            ?? '',
    tipoDocumento:       'CC',
    numeroDocumento:     '',
    fechaNacimiento:     '',
    telefonoPrincipal:   usuario.candidato.telefono           ?? '',
    telefonoAlternativo: '',
    ciudad:              usuario.candidato.ciudad              ?? '',
    barrio:              '',
    direccion:           '',
    zonaServicio:        'URBANA',
    foto:                usuario.candidato.foto                ?? null,
    clienteId:           usuario.candidato.id                  ?? null,
    }
}

if (usuario.empresa) {
    return {
    id:                  usuario.id,
    nombre:              usuario.empresa.nombre,
    email:               usuario.email,
    rol:                 usuario.rol ?? 'EMPRESA',
    apellido:            '',
    tipoDocumento:       usuario.empresa.rut ?? '',
    numeroDocumento:     usuario.empresa.rut ?? '',
    fechaNacimiento:     '',
    telefonoPrincipal:   '',
    telefonoAlternativo: '',
    ciudad:              usuario.empresa.ciudad              ?? '',
    barrio:              '',
    direccion:           '',
    zonaServicio:        'URBANA',
    foto:                usuario.empresa.logoUrl             ?? null,
    clienteId:           usuario.empresa.id                  ?? null,
    }
}

throw new AppError('Perfil no encontrado', 404)
}

// ── actualizarPerfil ──────────────────────────────────────────────────────────

export const actualizarPerfil = async (
usuarioId: number,
datos: ActualizarPerfilDatos
): Promise<PerfilResponse> => {

const {
    nombre,
    apellido,
    telefonoPrincipal,
    telefonoAlternativo,
    ciudad,
    barrio,
    direccion,
    zonaServicio,
    fechaNacimiento,
    foto,
} = datos

  // ── 2. Actualizar tabla `usuario` ─────────────────────────────────────────
const datosUsuario: { nombre?: string } = {}
if (nombre !== undefined) datosUsuario.nombre = nombre.trim()

if (Object.keys(datosUsuario).length > 0) {
    await prisma.usuario.update({
    where: { id: usuarioId },
    data:  datosUsuario,
    })
}

  // ── 3. Verificar si existe registro en `candidato` o `empresa` ──────────────────────────
const usuario = await prisma.usuario.findUnique({
    where:  { id: usuarioId },
    select: { email: true, candidato: { select: { id: true } }, empresa: { select: { id: true } } },
})

if (!usuario) throw new AppError('Usuario no encontrado', 404)

  // ── 4. Actualizar tabla `candidato` o `empresa` ────────────
if (usuario.candidato) {
    const datosCandidato: Record<string, unknown> = {}

    if (apellido            !== undefined) datosCandidato.apellido            = apellido.trim()
    if (telefonoPrincipal   !== undefined) datosCandidato.telefono           = telefonoPrincipal.trim()
    if (ciudad              !== undefined) datosCandidato.ciudad              = ciudad.trim()
    if (foto                !== undefined) datosCandidato.foto                = foto || null

    if (fechaNacimiento !== undefined && fechaNacimiento !== '') {
    datosCandidato.fechaNacimiento = new Date(fechaNacimiento)
    }

    if (Object.keys(datosCandidato).length > 0) {
    await prisma.candidato.update({
        where: { id: usuario.candidato.id },
        data:  datosCandidato,
    })
    }
} else if (usuario.empresa) {
    const datosEmpresa: Record<string, unknown> = {}

    if (nombre              !== undefined) datosEmpresa.nombre              = nombre.trim()
    if (ciudad              !== undefined) datosEmpresa.ciudad              = ciudad.trim()
    if (foto                !== undefined) datosEmpresa.logoUrl             = foto || null

    if (Object.keys(datosEmpresa).length > 0) {
    await prisma.empresa.update({
        where: { id: usuario.empresa.id },
        data:  datosEmpresa,
    })
    }
}

return obtenerPerfil(usuarioId)
}