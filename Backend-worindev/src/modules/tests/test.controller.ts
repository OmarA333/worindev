import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import { AuthRequest } from '../../middlewares/Auth.middleware'
import * as svc from './test.services'

export const listar             = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarTests()) })
export const debug              = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.debugTests()) })
export const detalle            = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerTest(Number(req.params.id))) })
export const crear              = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.crearTest(req.body)) })
export const actualizar         = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.actualizarTest(Number(req.params.id), req.body)) })
export const crearPregunta      = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.crearPregunta(Number(req.params.id), req.body)) })
export const responder          = asyncHandler(async (req: AuthRequest, res: Response) => { res.json(await svc.responderTest(Number(req.params.id), req.body, req.user!)) })
export const resultadosCandidato= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.resultadosCandidato(Number(req.params.candidatoId))) })
