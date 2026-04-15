import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/Asynchandler'
import * as svc from './vacante.services'

export const listarPublico = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarVacantes(req.query, true)) })
export const listar        = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.listarVacantes(req.query, false)) })
export const detalle       = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.obtenerVacante(Number(req.params.id))) })
export const crear         = asyncHandler(async (req: Request, res: Response) => { res.status(201).json(await svc.crearVacante(req.body)) })
export const actualizar    = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.actualizarVacante(Number(req.params.id), req.body)) })
export const cambiarEstado = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.cambiarEstadoVacante(Number(req.params.id), req.body.estado)) })
export const eliminar      = asyncHandler(async (req: Request, res: Response) => { res.json(await svc.eliminarVacante(Number(req.params.id))) })
