import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { AuthRequest } from '../../middlewares/Auth.middleware'
import * as svc from './empresa.services'

export const listarPublico = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarEmpresas(req.query, true)) })
export const listar        = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarEmpresas(req.query, false)) })
export const obtenerActual = asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.obtenerEmpresaActual(req.user!)) })
export const detalle       = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerEmpresa(Number(req.params.id))) })
export const actualizar    = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.actualizarEmpresa(Number(req.params.id), req.body)) })
export const verificar     = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.verificarEmpresa(Number(req.params.id))) })
