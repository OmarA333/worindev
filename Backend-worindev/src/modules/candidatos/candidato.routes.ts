import { Router } from 'express'
import * as ctrl from './candidato.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()

router.use(verifyToken)

router.get('/',    requireRole(['ADMIN', 'EMPRESA']), ctrl.listar)
router.get('/:id', requireRole(['ADMIN', 'EMPRESA', 'CANDIDATO']), ctrl.detalle)
router.put('/:id', requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizar)

// Habilidades
router.post('/:id/habilidades',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarHabilidad)
router.delete('/:id/habilidades/:hid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarHabilidad)

// Experiencia
router.post('/:id/experiencias',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarExperiencia)
router.delete('/:id/experiencias/:eid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarExperiencia)

// Educación
router.post('/:id/educaciones',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarEducacion)
router.delete('/:id/educaciones/:eid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarEducacion)

// Referencias
router.post('/:id/referencias',                requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarReferencia)
router.get('/referencias/verificar/:token',    ctrl.verificarReferencia)

export default router
