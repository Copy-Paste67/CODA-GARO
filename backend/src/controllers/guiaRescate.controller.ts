import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearGuia,
    listarGuias,
    buscarGuiaPorId,
    actualizarGuia,
    eliminarGuia,
} from '../models/guiaRescate.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { titulo, especie_objetivo, contenido_html, imagen_portada_url } = req.body;

    if (!titulo || !especie_objetivo || !contenido_html) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const id_guia = await crearGuia(
        req.usuario!.id_usuario,
        titulo,
        especie_objetivo,
        contenido_html,
        imagen_portada_url,
    );

    res.status(201).json({ id_guia, titulo, especie_objetivo });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { especie_objetivo } = req.query;

    const guias = await listarGuias({
        especie_objetivo: especie_objetivo as string | undefined,
    });

    res.json(guias);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const guia = await buscarGuiaPorId(Number(req.params.id));

    if (!guia) {
        throw new AppError('Guía no encontrada', 404);
    }

    res.json(guia);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_guia = Number(req.params.id);
    const guia = await buscarGuiaPorId(id_guia);

    if (!guia) {
        throw new AppError('Guía no encontrada', 404);
    }

    const esAutor = guia.autor_id === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esAutor && !esAdmin) {
        throw new AppError('No puedes editar una guía que no es tuya', 403);
    }

    const { titulo, especie_objetivo, contenido_html, imagen_portada_url } = req.body;

    if (!titulo || !especie_objetivo || !contenido_html) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    await actualizarGuia(id_guia, titulo, especie_objetivo, contenido_html, imagen_portada_url);
    res.json({ mensaje: 'Guía actualizada' });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_guia = Number(req.params.id);
    const guia = await buscarGuiaPorId(id_guia);

    if (!guia) {
        throw new AppError('Guía no encontrada', 404);
    }

    const esAutor = guia.autor_id === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esAutor && !esAdmin) {
        throw new AppError('No puedes eliminar una guía que no es tuya', 403);
    }

    await eliminarGuia(id_guia);
    res.json({ mensaje: 'Guía eliminada' });
});