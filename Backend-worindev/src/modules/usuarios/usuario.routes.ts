import { Router } from 'express'
import * as ctrl from './usuario.controller'
import { verifyToken } from '../../middlewares/Auth.middleware'
import { requireRole } from '../../middlewares/Role.middleware'

const router = Router()
router.use(verifyToken)

router.get('/',    requireRole(['ADMIN']), ctrl.listar)
router.get('/:id', requireRole(['ADMIN']), ctrl.detalle)
router.patch('/:id/estado', requireRole(['ADMIN']), ctrl.cambiarEstado)
router.delete('/:id', requireRole(['ADMIN']), ctrl.eliminar)

// Perfil propio
router.get('/me/perfil', ctrl.miPerfil)
router.put('/me/perfil', ctrl.actualizarPerfil)

export default router
