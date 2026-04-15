import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { AuthRequest } from '../../middlewares/Auth.middleware'
import * as svc from './usuario.services'

export const listar          = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarUsuarios(req.query)) })
export const detalle         = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerUsuario(Number(req.params.id))) })
export const cambiarEstado   = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.cambiarEstado(Number(req.params.id), req.body.estado)) })
export const eliminar        = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarUsuario(Number(req.params.id))) })
export const miPerfil        = asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.obtenerUsuario(req.user!.id)) })
export const actualizarPerfil= asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.actualizarPerfil(req.user!.id, req.body)) })
