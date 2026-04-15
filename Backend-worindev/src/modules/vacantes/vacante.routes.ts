import { Router } from 'express'
import * as ctrl from './vacante.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()

// Pública — candidatos sin cuenta pueden ver vacantes activas
router.get('/public', ctrl.listarPublico)

router.use(verifyToken)

router.get('/',    ctrl.listar)
router.get('/:id', ctrl.detalle)
router.post('/',   requireRole(['ADMIN', 'EMPRESA']), ctrl.crear)
router.put('/:id', requireRole(['ADMIN', 'EMPRESA']), ctrl.actualizar)
router.patch('/:id/estado', requireRole(['ADMIN', 'EMPRESA']), ctrl.cambiarEstado)
router.delete('/:id', requireRole(['ADMIN']), ctrl.eliminar)

export default router
