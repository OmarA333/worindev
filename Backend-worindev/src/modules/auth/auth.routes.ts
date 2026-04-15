import { Router } from 'express'
import { registro, loginController, recuperar, verificarOtp, resetearPassword } from './auth.controller'

const router = Router()

router.post('/registro',         registro)
router.post('/login',            loginController)
router.post('/recuperar',        recuperar)
router.post('/verificar-otp',    verificarOtp)
router.post('/reset-password',   resetearPassword)

export default router
