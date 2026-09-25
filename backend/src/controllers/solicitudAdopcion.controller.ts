import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearSolicitud,
    listarSolicitudes,
    buscarSolicitudPorId,
    buscarSolicitudPorAdopcionYAdoptante,
    actualizarEstadoSolicitud,
    eliminarSolicitud,
} from '../models/solicitudAdopcion.model';
import { buscarPublicacionPorId } from '../models/publicacionAdopcion.model';

const ESTADOS_VALIDOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id_adopcion, mensaje } = req.body;

    if (!id_adopcion) {
        throw new AppError('El id de la publicación es obligatorio', 400);
    }

    const publicacion = await buscarPublicacionPorId(Number(id_adopcion));

    if (!publicacion) {
        throw new AppError('Publicación no encontrada', 404);
    }

    if (publicacion.id_usuario === req.usuario!.id_usuario) {
        throw new AppError('No puedes solicitar adoptar tu propia publicación', 400);
    }

    if (publicacion.estado === 'ADOPTADO') {
        throw new AppError('Esta mascota ya fue adoptada', 400);
    }

    const existente = await buscarSolicitudPorAdopcionYAdoptante(
        Number(id_adopcion),
        req.usuario!.id_usuario,
    );

    if (existente) {
        throw new AppError('Ya enviaste una solicitud para esta publicación', 409);
    }

    const id_solicitud = await crearSolicitud(
        Number(id_adopcion),
        req.usuario!.id_usuario,
        mensaje,
    );

    res.status(201).json({ id_solicitud, id_adopcion, estado: 'PENDIENTE' });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id_adopcion, id_adoptante, estado } = req.query;

    const esAdmin = req.usuario!.rol === 'ADMIN';

    const filtros: { id_adopcion?: number; id_adoptante?: number; estado?: string } = {
        id_adopcion: id_adopcion ? Number(id_adopcion) : undefined,
        estado: estado as string | undefined,
    };

    // Un usuario normal solo ve sus propias solicitudes
    if (!esAdmin) {
        filtros.id_adoptante = req.usuario!.id_usuario;
    } else if (id_adoptante) {
        filtros.id_adoptante = Number(id_adoptante);
    }

    const solicitudes = await listarSolicitudes(filtros);
    res.json(solicitudes);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const solicitud = await buscarSolicitudPorId(Number(req.params.id));

    if (!solicitud) {
        throw new AppError('Solicitud no encontrada', 404);
    }

    const esAdmin = req.usuario!.rol === 'ADMIN';
    const esAdoptante = solicitud.id_adoptante === req.usuario!.id_usuario;

    // También el dueño de la publicación puede verla
    const publicacion = await buscarPublicacionPorId(solicitud.id_adopcion);
    const esDuenoPublicacion = publicacion?.id_usuario === req.usuario!.id_usuario;

    if (!esAdmin && !esAdoptante && !esDuenoPublicacion) {
        throw new AppError('No puedes ver una solicitud que no te pertenece', 403);
    }

    res.json(solicitud);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_solicitud = Number(req.params.id);
    const solicitud = await buscarSolicitudPorId(id_solicitud);

    if (!solicitud) {
        throw new AppError('Solicitud no encontrada', 404);
    }

    const publicacion = await buscarPublicacionPorId(solicitud.id_adopcion);

    if (!publicacion) {
        throw new AppError('Publicación asociada no encontrada', 404);
    }

    const esAdmin = req.usuario!.rol === 'ADMIN';
    const esDuenoPublicacion = publicacion.id_usuario === req.usuario!.id_usuario;

    if (!esAdmin && !esDuenoPublicacion) {
        throw new AppError('Solo el dueño de la publicación puede cambiar el estado', 403);
    }

    const { estado } = req.body;

    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
        throw new AppError('Estado inválido', 400);
    }

    await actualizarEstadoSolicitud(id_solicitud, estado);
    res.json({ mensaje: 'Solicitud actualizada', estado });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_solicitud = Number(req.params.id);
    const solicitud = await buscarSolicitudPorId(id_solicitud);

    if (!solicitud) {
        throw new AppError('Solicitud no encontrada', 404);
    }

    const esAdmin = req.usuario!.rol === 'ADMIN';
    const esAdoptante = solicitud.id_adoptante === req.usuario!.id_usuario;

    const publicacion = await buscarPublicacionPorId(solicitud.id_adopcion);
    const esDuenoPublicacion = publicacion?.id_usuario === req.usuario!.id_usuario;

    if (!esAdmin && !esAdoptante && !esDuenoPublicacion) {
        throw new AppError('No puedes cancelar una solicitud que no te pertenece', 403);
    }

    await eliminarSolicitud(id_solicitud);
    res.json({ mensaje: 'Solicitud eliminada' });
});