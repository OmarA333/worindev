import { Router } from 'express'
import * as ctrl from './test.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()
router.use(verifyToken)

// Resultados (debe estar antes de /:id para evitar conflictos)
router.get('/resultados/candidato/:candidatoId', requireRole(['ADMIN', 'EMPRESA', 'CANDIDATO']), ctrl.resultadosCandidato)
router.get('/debug/all', ctrl.debug)

router.get('/',    ctrl.listar)
router.get('/:id', ctrl.detalle)
router.post('/',   requireRole(['ADMIN']), ctrl.crear)
router.put('/:id', requireRole(['ADMIN']), ctrl.actualizar)
router.post('/:id/preguntas', requireRole(['ADMIN']), ctrl.crearPregunta)

// Candidato envía respuestas
router.post('/:id/responder', requireRole(['CANDIDATO']), ctrl.responder)

export default router
