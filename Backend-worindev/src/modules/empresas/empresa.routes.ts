import { Router } from 'express'
import * as ctrl from './empresa.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()

router.get('/public', ctrl.listarPublico)

router.use(verifyToken)

router.get('/me',  requireRole(['EMPRESA']), ctrl.obtenerActual)
router.get('/',    requireRole(['ADMIN']), ctrl.listar)
router.get('/:id', ctrl.detalle)
router.put('/:id', requireRole(['ADMIN', 'EMPRESA']), ctrl.actualizar)
router.patch('/:id/verificar', requireRole(['ADMIN']), ctrl.verificar)

export default router
