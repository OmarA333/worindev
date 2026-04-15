import { Router } from 'express'
import * as ctrl from './entrevista.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()

// Pública — confirmar asistencia por token
router.get('/confirmar/:token', ctrl.confirmarAsistencia)

router.use(verifyToken)

router.get('/',    ctrl.listar)
router.get('/:id', ctrl.detalle)
router.post('/',   requireRole(['ADMIN', 'EMPRESA']), ctrl.crear)
router.patch('/:id/estado', requireRole(['ADMIN', 'EMPRESA']), ctrl.cambiarEstado)
router.delete('/:id', requireRole(['ADMIN']), ctrl.eliminar)

export default router
