import { Router } from 'express'
import * as ctrl from './postulacion.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()
router.use(verifyToken)

router.get('/',    ctrl.listar)
router.get('/:id', ctrl.detalle)
router.post('/',   requireRole(['CANDIDATO']), ctrl.postular)
router.patch('/:id/estado', requireRole(['ADMIN', 'EMPRESA']), ctrl.cambiarEstado)
router.delete('/:id', requireRole(['ADMIN', 'CANDIDATO']), ctrl.retirar)

export default router
