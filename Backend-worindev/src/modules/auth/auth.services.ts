import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma'
import transporter from '../../config/mailer'
import { AppError } from '../../utils/AppError'
import { emailBienvenida, emailOtp } from '../../utils/email.templates'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) throw new Error('JWT_SECRET no definido')

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────
const RegistroSchema = z.object({
  email:    z.string().trim().email('Email inválido').toLowerCase(),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(64),
  rol:      z.enum(['CANDIDATO', 'EMPRESA']),
  nombre:   z.string().trim().min(2).max(100),
  apellido: z.string().trim().min(2).max(100).optional(),
  // Empresa
  nombreEmpresa: z.string().trim().min(2).max(150).optional(),
  rut:           z.string().trim().optional(),
  sector:        z.string().trim().optional(),
})

const ResetSchema = z.object({
  email:             z.string().email(),
  otp:               z.string().length(6).regex(/^\d{6}$/),
  nuevaPassword:     z.string().min(6).max(64),
  confirmarPassword: z.string(),
}).refine(d => d.nuevaPassword === d.confirmarPassword, {
  message: 'Las contraseñas no coinciden', path: ['confirmarPassword']
})

// ─── REGISTRO ─────────────────────────────────────────────────────────────────
export const registrar = async (data: unknown) => {
  const parsed = RegistroSchema.safeParse(data)
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? 'Datos inválidos', 400)

  const d = parsed.data

  const existe = await prisma.usuario.findUnique({ where: { email: d.email } })
  if (existe) throw new AppError('El correo ya está registrado', 409)

  const hash = await bcrypt.hash(d.password, 10)

  const usuario = await prisma.$transaction(async (tx) => {
    const u = await tx.usuario.create({
      data: { email: d.email, password: hash, rol: d.rol }
    })

    if (d.rol === 'CANDIDATO') {
      await tx.candidato.create({
        data: { usuarioId: u.id, nombre: d.nombre, apellido: d.apellido ?? '' }
      })
    } else {
      await tx.empresa.create({
        data: { usuarioId: u.id, nombre: d.nombreEmpresa ?? d.nombre, rut: d.rut, sector: d.sector }
      })
    }
    return u
  })

  // Email bienvenida
  const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '')
  const mail = emailBienvenida({ nombre: d.nombre, rol: d.rol, loginUrl: `${base}/login` })
  await transporter.sendMail({ from: process.env.MAIL_FROM, to: d.email, ...mail }).catch(console.error)

  return { message: 'Registro exitoso', usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol } }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { candidato: true, empresa: true }
  })

  if (!usuario || usuario.estado === 'INACTIVO')
    throw new AppError('Credenciales inválidas', 401)

  const ok = await bcrypt.compare(password, usuario.password)
  if (!ok) throw new AppError('Credenciales inválidas', 401)

  const nombre = usuario.candidato
    ? `${usuario.candidato.nombre} ${usuario.candidato.apellido}`.trim()
    : usuario.empresa?.nombre ?? ''

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '8h' }
  )

  return {
    token,
    usuario: {
      id:          usuario.id,
      email:       usuario.email,
      rol:         usuario.rol,
      nombre,
      candidatoId: usuario.candidato?.id ?? null,
      empresaId:   usuario.empresa?.id   ?? null,
      matchScore:  usuario.candidato?.matchScore ?? null,
    }
  }
}

// ─── RECUPERAR CONTRASEÑA ─────────────────────────────────────────────────────
export const recuperarPassword = async (email: string) => {
  const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!usuario) return { message: 'Si el correo está registrado, recibirás un código.' }

  const otp       = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.passwordResetOtp.updateMany({ where: { usuarioId: usuario.id, usado: false }, data: { usado: true } })
  await prisma.passwordResetOtp.create({ data: { usuarioId: usuario.id, email: usuario.email, otp, expiresAt } })

  const nombre = (await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } }))?.nombre
    ?? (await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } }))?.nombre
    ?? 'Usuario'

  const mail = emailOtp({ nombre, otp })
  await transporter.sendMail({ from: process.env.MAIL_FROM, to: usuario.email, ...mail }).catch(console.error)

  return { message: 'Si el correo está registrado, recibirás un código.' }
}

// ─── VERIFICAR OTP ────────────────────────────────────────────────────────────
export const verificarOtp = async (email: string, otp: string) => {
  const registro = await prisma.passwordResetOtp.findFirst({
    where: { email: email.toLowerCase().trim(), otp, usado: false, expiresAt: { gt: new Date() } }
  })
  if (!registro) throw new AppError('Código inválido o expirado', 400)
  return { message: 'Código válido', email }
}

// ─── RESETEAR CONTRASEÑA ──────────────────────────────────────────────────────
export const resetearPassword = async (
  email: string, otp: string, nuevaPassword: string, confirmarPassword: string
) => {
  const parsed = ResetSchema.safeParse({ email, otp, nuevaPassword, confirmarPassword })
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? 'Datos inválidos', 400)

  const registro = await prisma.passwordResetOtp.findFirst({
    where: { email: email.toLowerCase().trim(), otp, usado: false, expiresAt: { gt: new Date() } }
  })
  if (!registro) throw new AppError('Código inválido o expirado', 400)

  const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!usuario) throw new AppError('Usuario no encontrado', 404)

  const misma = await bcrypt.compare(nuevaPassword, usuario.password)
  if (misma) throw new AppError('La nueva contraseña no puede ser igual a la actual', 400)

  const hash = await bcrypt.hash(nuevaPassword, 10)
  await Promise.all([
    prisma.usuario.update({ where: { id: usuario.id }, data: { password: hash } }),
    prisma.passwordResetOtp.update({ where: { id: registro.id }, data: { usado: true } }),
  ])

  return { message: 'Contraseña actualizada correctamente' }
}
