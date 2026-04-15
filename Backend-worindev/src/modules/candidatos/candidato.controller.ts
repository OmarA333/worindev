import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import * as svc from './candidato.services'

export const listar           = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarCandidatos(req.query)) })
export const detalle          = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerCandidato(Number(req.params.id))) })
export const actualizar       = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.actualizarCandidato(Number(req.params.id), req.body)) })
export const agregarHabilidad = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.agregarHabilidad(Number(req.params.id), req.body)) })
export const eliminarHabilidad= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarHabilidad(Number(req.params.id), Number(req.params.hid))) })
export const agregarExperiencia= asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.agregarExperiencia(Number(req.params.id), req.body)) })
export const eliminarExperiencia= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarExperiencia(Number(req.params.id), Number(req.params.eid))) })
export const agregarEducacion = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.agregarEducacion(Number(req.params.id), req.body)) })
export const eliminarEducacion= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarEducacion(Number(req.params.id), Number(req.params.eid))) })
export const agregarReferencia= asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.agregarReferencia(Number(req.params.id), req.body)) })
export const verificarReferencia= asyncHandler(async (req: Request, res: Response) => { res.json(await svc.verificarReferencia(req.params.token)) })
