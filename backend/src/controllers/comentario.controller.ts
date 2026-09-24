import {Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearComentario,
    listarComentarios,
    buscarComentarioPorId,
    actualizarComentario,
    eliminarComentario,
} from '../models/comentario.model';
import { buscarPublicacionPorId } from '../models/publicacionAdopcion.model';
import { buscarReportePorId } from '../models/reporteMascota.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { contenido, id_adopcion, id_reporte } = req.body;

    if (!contenido) {
        throw new AppError('El contenido del comentario es obligatorio', 400);
    }

    const tieneAdopcion = id_adopcion !== undefined && id_adopcion !== null;
    const tieneReporte = id_reporte !== undefined && id_reporte !== null;

    if (tieneAdopcion === tieneReporte) {
        throw new AppError(
            'El comentario debe estar asociado a una publicación o a un reporte, pero no a ambos',
            400,
        );
    }

     let idAdopcionFinal: number | null = null;
    let idReporteFinal: number | null = null;

    if (tieneAdopcion) {
        const publicacion = await buscarPublicacionPorId(Number(id_adopcion));

        if (!publicacion) {
            throw new AppError('Publicación no encontrada', 404);
        }

        idAdopcionFinal = Number(id_adopcion);
    }

    if (tieneReporte) {
        const reporte = await buscarReportePorId(Number(id_reporte));

        if (!reporte) {
            throw new AppError('Reporte no encontrado', 404);
        }

        idReporteFinal = Number(id_reporte);
    }

    const id_comentario = await crearComentario(
        req.usuario!.id_usuario,
        contenido,
        idAdopcionFinal,
        idReporteFinal,
    );

    res.status(201).json({
        id_comentario,
        contenido,
        id_adopcion: idAdopcionFinal,
        id_reporte: idReporteFinal,
    });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id_adopcion, id_reporte } = req.query;

    const comentarios = await listarComentarios({
        id_adopcion: id_adopcion ? Number(id_adopcion) : undefined,
        id_reporte: id_reporte ? Number(id_reporte) : undefined,
    });

    res.json(comentarios);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const comentario = await buscarComentarioPorId(Number(req.params.id));

    if (!comentario) {
        throw new AppError('Comentario no encontrado', 404);
    }

    res.json(comentario);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_comentario = Number(req.params.id);
    const comentario = await buscarComentarioPorId(id_comentario);

    if (!comentario) {
        throw new AppError('Comentario no encontrado', 404);
    }

    const esDueno = comentario.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes editar un comentario que no es tuyo', 403);
    }

    const { contenido } = req.body;

    if (!contenido) {
        throw new AppError('El contenido del comentario es obligatorio', 400);
    }

    await actualizarComentario(id_comentario, contenido);
    res.json({ mensaje: 'Comentario actualizado' });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_comentario = Number(req.params.id);
    const comentario = await buscarComentarioPorId(id_comentario);

    if (!comentario) {
        throw new AppError('Comentario no encontrado', 404);
    }

    const esDueno = comentario.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes eliminar un comentario que no es tuyo', 403);
    }

    await eliminarComentario(id_comentario);
    res.json({ mensaje: 'Comentario eliminado' });
});

