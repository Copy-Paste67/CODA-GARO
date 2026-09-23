import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearPublicacion,
    listarPublicaciones,
    buscarPublicacionPorId,
    actualizarPublicacion,
    eliminarPublicacion,
} from '../models/publicacionAdopcion.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { nombre_animal, especie, raza_aparente, edad_aproximada, tamanio, descripcion } = req.body;

    if (!especie || !tamanio || !descripcion) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const id_adopcion = await crearPublicacion(req.usuario!.id_usuario, {
        nombre_animal,
        especie,
        raza_aparente,
        edad_aproximada,
        tamanio,
        descripcion,
    });

    res.status(201).json({ id_adopcion, especie, tamanio, descripcion, estado: 'DISPONIBLE' });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { especie, tamanio, estado } = req.query;
    const publicaciones = await listarPublicaciones({
        especie: especie as string,
        tamanio: tamanio as string,
        estado: estado as string,
    });

    res.json(publicaciones);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const publicacion = await buscarPublicacionPorId(Number(req.params.id));

    if (!publicacion) {
        throw new AppError('Publicación no encontrada', 404);
    }

    res.json(publicacion);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_adopcion = Number(req.params.id);
    const publicacion = await buscarPublicacionPorId(id_adopcion);

    if (!publicacion) {
        throw new AppError('Publicación no encontrada', 404);
    }

    const esDueno = publicacion.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes editar una publicación que no es tuya', 403);
    }

    const { nombre_animal, especie, raza_aparente, edad_aproximada, tamanio, descripcion, estado } = req.body;
    await actualizarPublicacion(id_adopcion, {
        nombre_animal,
        especie,
        raza_aparente,
        edad_aproximada,
        tamanio,
        descripcion,
        estado,
    });

    res.json({ mensaje: 'Publicación actualizada' });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_adopcion = Number(req.params.id);
    const publicacion = await buscarPublicacionPorId(id_adopcion);

    if (!publicacion) {
        throw new AppError('Publicación no encontrada', 404);
    }

    const esDueno = publicacion.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes eliminar una publicación que no es tuya', 403);
    }

    await eliminarPublicacion(id_adopcion);
    res.json({ mensaje: 'Publicación eliminada' });
});