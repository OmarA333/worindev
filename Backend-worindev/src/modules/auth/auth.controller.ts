import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import * as authService from './auth.services'

export const registro = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await authService.registrar(req.body))
})

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son requeridos' })
  res.json(await authService.login(email, password))
})

export const recuperar = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'El email es requerido' })
  res.json(await authService.recuperarPassword(email))
})

export const verificarOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ message: 'Email y código son requeridos' })
  res.json(await authService.verificarOtp(email, otp))
})

export const resetearPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, nuevaPassword, confirmarPassword } = req.body
  if (!email || !otp || !nuevaPassword || !confirmarPassword)
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  res.json(await authService.resetearPassword(email, otp, nuevaPassword, confirmarPassword))
})
