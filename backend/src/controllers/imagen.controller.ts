import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearImagen,
    listarImagenes,
    buscarImagenPorId,
    eliminarImagen,
} from '../models/imagen.model';
import { buscarPublicacionPorId } from '../models/publicacionAdopcion.model';
import { buscarReportePorId } from '../models/reporteMascota.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { url_imagen, id_adopcion, id_reporte } = req.body;

    if (!url_imagen) {
        throw new AppError('La url de la imagen es obligatoria', 400);
    }

    const tieneAdopcion = id_adopcion !== undefined && id_adopcion !== null;
    const tieneReporte = id_reporte !== undefined && id_reporte !== null;

    if (tieneAdopcion === tieneReporte) {
        throw new AppError(
            'La imagen debe estar asociada a una publicación o a un reporte, pero no a ambos',
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

        const esDueno = publicacion.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            throw new AppError('No puedes agregar imágenes a una publicación que no es tuya', 403);
        }

        idAdopcionFinal = Number(id_adopcion);
    }

    if (tieneReporte) {
        const reporte = await buscarReportePorId(Number(id_reporte));

        if (!reporte) {
            throw new AppError('Reporte no encontrado', 404);
        }

        const esDueno = reporte.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            throw new AppError('No puedes agregar imágenes a un reporte que no es tuyo', 403);
        }

        idReporteFinal = Number(id_reporte);
    }

    const id_imagen = await crearImagen(url_imagen, idAdopcionFinal, idReporteFinal);

    res.status(201).json({ id_imagen, url_imagen, id_adopcion: idAdopcionFinal, id_reporte: idReporteFinal });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id_adopcion, id_reporte } = req.query;

    const imagenes = await listarImagenes({
        id_adopcion: id_adopcion ? Number(id_adopcion) : undefined,
        id_reporte: id_reporte ? Number(id_reporte) : undefined,
    });

    res.json(imagenes);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const imagen = await buscarImagenPorId(Number(req.params.id));

    if (!imagen) {
        throw new AppError('Imagen no encontrada', 404);
    }

    res.json(imagen);
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_imagen = Number(req.params.id);
    const imagen = await buscarImagenPorId(id_imagen);

    if (!imagen) {
        throw new AppError('Imagen no encontrada', 404);
    }

    const esAdmin = req.usuario!.rol === 'ADMIN';
    let esDueno = false;

    if (imagen.id_adopcion) {
        const publicacion = await buscarPublicacionPorId(imagen.id_adopcion);
        esDueno = publicacion?.id_usuario === req.usuario!.id_usuario;
    } else if (imagen.id_reporte) {
        const reporte = await buscarReportePorId(imagen.id_reporte);
        esDueno = reporte?.id_usuario === req.usuario!.id_usuario;
    }

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes eliminar una imagen que no te pertenece', 403);
    }

    await eliminarImagen(id_imagen);
    res.json({ mensaje: 'Imagen eliminada' });
});