import { Router } from 'express'
import * as ctrl from './candidato.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'
import { upload } from '../../middlewares/upload.middleware'

const router = Router()

router.use(verifyToken)

// Rutas especiales (deben estar antes de /:id)
router.get('/me', requireRole(['CANDIDATO']), ctrl.obtenerActual)
router.get('/referencias/verificar/:token', ctrl.verificarReferencia)

// Rutas generales
router.get('/',    requireRole(['ADMIN', 'EMPRESA']), ctrl.listar)
router.get('/:id', requireRole(['ADMIN', 'EMPRESA', 'CANDIDATO']), ctrl.detalle)
router.put('/:id', requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizar)
router.post('/:id/cv', requireRole(['ADMIN', 'CANDIDATO']), upload.single('cv'), ctrl.subirCV)

// Habilidades
router.post('/:id/habilidades',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarHabilidad)
router.put('/:id/habilidades/:hid',    requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizarHabilidad)
router.delete('/:id/habilidades/:hid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarHabilidad)

// Experiencia
router.post('/:id/experiencias',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarExperiencia)
router.put('/:id/experiencias/:eid',    requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizarExperiencia)
router.delete('/:id/experiencias/:eid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarExperiencia)

// Educación
router.post('/:id/educaciones',        requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarEducacion)
router.put('/:id/educaciones/:eid',    requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizarEducacion)
router.delete('/:id/educaciones/:eid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarEducacion)

// Referencias
router.post('/:id/referencias', requireRole(['ADMIN', 'CANDIDATO']), ctrl.agregarReferencia)
router.put('/:id/referencias/:rid',    requireRole(['ADMIN', 'CANDIDATO']), ctrl.actualizarReferencia)
router.delete('/:id/referencias/:rid', requireRole(['ADMIN', 'CANDIDATO']), ctrl.eliminarReferencia)

export default router
