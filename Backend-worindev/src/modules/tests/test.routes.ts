import { Router } from 'express'
import * as ctrl from './test.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()
router.use(verifyToken)

router.get('/',    ctrl.listar)
router.get('/:id', ctrl.detalle)
router.post('/',   requireRole(['ADMIN']), ctrl.crear)
router.put('/:id', requireRole(['ADMIN']), ctrl.actualizar)

// Candidato envía respuestas
router.post('/:id/responder', requireRole(['CANDIDATO']), ctrl.responder)

// Resultados
router.get('/resultados/candidato/:candidatoId', requireRole(['ADMIN', 'EMPRESA', 'CANDIDATO']), ctrl.resultadosCandidato)

export default router
