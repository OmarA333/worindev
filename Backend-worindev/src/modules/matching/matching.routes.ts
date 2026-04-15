import { Router } from 'express'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { calcularMatchScore, calcularMatchConVacante } from './matching.services'
import prisma from '../../config/prisma'
import { AppError } from '../../utils/AppError'

const router = Router()
router.use(verifyToken)

// GET /api/matching/candidato/:id — score general del candidato
router.get('/candidato/:id', requireRole(['ADMIN', 'EMPRESA', 'CANDIDATO']),
  asyncHandler(async (req, res) => {
    const score = await calcularMatchScore(Number(req.params.id))
    res.json({ candidatoId: Number(req.params.id), matchScore: score })
  })
)

// GET /api/matching/vacante/:vacanteId — top candidatos para una vacante (≥93%)
router.get('/vacante/:vacanteId', requireRole(['ADMIN', 'EMPRESA']),
  asyncHandler(async (req, res) => {
    const vacanteId = Number(req.params.vacanteId)
    const umbral    = Number(req.query.umbral ?? 0)

    const candidatos = await prisma.candidato.findMany({
      include: { habilidades: true, usuario: { select: { email: true } } }
    })

    const resultados = await Promise.all(
      candidatos.map(async c => ({
        candidatoId: c.id,
        nombre:      `${c.nombre} ${c.apellido}`.trim(),
        email:       c.usuario.email,
        matchScore:  await calcularMatchConVacante(c.id, vacanteId),
      }))
    )

    const filtrados = resultados
      .filter(r => r.matchScore >= umbral)
      .sort((a, b) => b.matchScore - a.matchScore)

    res.json({ vacanteId, total: filtrados.length, candidatos: filtrados })
  })
)

// POST /api/matching/recalcular/:candidatoId — forzar recálculo
router.post('/recalcular/:candidatoId', requireRole(['ADMIN']),
  asyncHandler(async (req, res) => {
    const id    = Number(req.params.candidatoId)
    const score = await calcularMatchScore(id)
    await prisma.candidato.update({ where: { id }, data: { matchScore: score } })
    res.json({ message: 'Score recalculado', matchScore: score })
  })
)

export default router
