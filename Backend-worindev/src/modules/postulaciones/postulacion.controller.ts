import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { AuthRequest } from '../../middlewares/Auth.middleware'
import * as svc from './postulacion.services'

export const listar       = asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.listarPostulaciones(req.query, req.user!)) })
export const detalle      = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerPostulacion(Number(req.params.id))) })
export const postular     = asyncHandler(async (req: AuthRequest, res: Response) => { res.status(201).json(await svc.postular(req.body, req.user!)) })
export const cambiarEstado= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.cambiarEstado(Number(req.params.id), req.body.estado, req.body.notasAdmin)) })
export const retirar      = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.retirarPostulacion(Number(req.params.id))) })
