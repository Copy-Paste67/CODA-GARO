import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearRefugio,
    listarRefugios,
    buscarRefugioPorId,
    buscarRefugioPorUsuario,
    actualizarRefugio,
    eliminarRefugio,
    verificarRefugio,
} from '../models/refugio.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { nombre_refugio, direccion, descripcion, logo_url } = req.body;
    const id_usuario = req.usuario!.id_usuario;

    if (!nombre_refugio || !direccion) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const refugioExistente = await buscarRefugioPorUsuario(id_usuario);

    if (refugioExistente) {
        throw new AppError('Este usuario ya tiene un refugio registrado', 409);
    }

    const id_refugio = await crearRefugio(id_usuario, nombre_refugio, direccion, descripcion, logo_url);
    res.status(201).json({ id_refugio, nombre_refugio, direccion });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const refugios = await listarRefugios();
    res.json(refugios);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const refugio = await buscarRefugioPorId(Number(req.params.id));

    if (!refugio) {
        throw new AppError('Refugio no encontrado', 404);
    }

    res.json(refugio);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_refugio = Number(req.params.id);
    const refugio = await buscarRefugioPorId(id_refugio);

    if (!refugio) {
        throw new AppError('Refugio no encontrado', 404);
    }

    const esDueno = refugio.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes editar un refugio que no es tuyo', 403);
    }

    const { nombre_refugio, direccion, descripcion, logo_url } = req.body;
    await actualizarRefugio(id_refugio, nombre_refugio, direccion, descripcion, logo_url);
    res.json({ mensaje: 'Refugio actualizado' });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_refugio = Number(req.params.id);
    const refugio = await buscarRefugioPorId(id_refugio);

    if (!refugio) {
        throw new AppError('Refugio no encontrado', 404);
    }

    const esDueno = refugio.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes eliminar un refugio que no es tuyo', 403);
    }

    await eliminarRefugio(id_refugio);
    res.json({ mensaje: 'Refugio eliminado' });
});

export const verificar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_refugio = Number(req.params.id);
    const refugio = await buscarRefugioPorId(id_refugio);

    if (!refugio) {
        throw new AppError('Refugio no encontrado', 404);
    }

    const { verificado } = req.body;

    if (typeof verificado !== 'boolean') {
        throw new AppError('El campo verificado debe ser true o false', 400);
    }

    await verificarRefugio(id_refugio, verificado);
    res.json({ mensaje: `Refugio ${verificado ? 'verificado' : 'desverificado'} correctamente` });
});