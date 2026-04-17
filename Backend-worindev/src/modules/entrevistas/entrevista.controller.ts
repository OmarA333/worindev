import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { AuthRequest } from '../../middlewares/Auth.middleware'
import * as svc from './entrevista.services'

export const listar             = asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.listarEntrevistas(req.query, req.user!)) })
export const detalle            = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerEntrevista(Number(req.params.id))) })
export const crear              = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.crearEntrevista(req.body)) })
export const cambiarEstado      = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.cambiarEstado(Number(req.params.id), req.body.estado)) })
export const eliminar           = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarEntrevista(Number(req.params.id))) })
export const confirmarAsistencia= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.confirmarAsistencia(String(req.params.token))) })
