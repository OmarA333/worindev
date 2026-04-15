import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'

import authRoutes         from './modules/auth/auth.routes'
import candidatoRoutes    from './modules/candidatos/candidato.routes'
import empresaRoutes      from './modules/empresas/empresa.routes'
import vacanteRoutes      from './modules/vacantes/vacante.routes'
import postulacionRoutes  from './modules/postulaciones/postulacion.routes'
import entrevistaRoutes   from './modules/entrevistas/entrevista.routes'
import testRoutes         from './modules/tests/test.routes'
import matchingRoutes     from './modules/matching/matching.routes'
import usuarioRoutes      from './modules/usuarios/usuario.routes'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler'

const app = express()

// ─── SEGURIDAD ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin:         ['http://localhost:3002', 'http://localhost:3001'],
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '5mb' }))

// ─── ARCHIVOS ESTÁTICOS ───────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 15,
  message: { message: 'Demasiados intentos. Intenta en 15 minutos.' },
  standardHeaders: true, legacyHeaders: false,
})

app.use('/api/auth/login',          authLimiter)
app.use('/api/auth/registro',       authLimiter)
app.use('/api/auth/recuperar',      authLimiter)
app.use('/api/auth/reset-password', authLimiter)

// ─── RUTAS ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/candidatos',    candidatoRoutes)
app.use('/api/empresas',      empresaRoutes)
app.use('/api/vacantes',      vacanteRoutes)
app.use('/api/postulaciones', postulacionRoutes)
app.use('/api/entrevistas',   entrevistaRoutes)
app.use('/api/tests',         testRoutes)
app.use('/api/matching',      matchingRoutes)
app.use('/api/usuarios',      usuarioRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'worindev', version: '1.0.0' }))

// ─── ERROR HANDLERS ───────────────────────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

export default app
