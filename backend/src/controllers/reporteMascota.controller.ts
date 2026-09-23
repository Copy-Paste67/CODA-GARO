import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearReporte,
    listarReportes,
    buscarReportePorId,
    actualizarReporte,
    eliminarReporte,
} from '../models/reporteMascota.model';

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { tipo, especie, descripcion_fisica, ubicacion_suceso, fecha_suceso } = req.body;

    if (!tipo || !especie || !descripcion_fisica || !ubicacion_suceso || !fecha_suceso) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const id_reporte = await crearReporte(req.usuario!.id_usuario, {
        tipo,
        especie,
        descripcion_fisica,
        ubicacion_suceso,
        fecha_suceso,
    });

    res.status(201).json({ id_reporte, tipo, especie, estado: 'BUSCANDO' });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { tipo, especie, estado } = req.query;
    const reportes = await listarReportes({
        tipo: tipo as string,
        especie: especie as string,
        estado: estado as string,
    });

    res.json(reportes);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const reporte = await buscarReportePorId(Number(req.params.id));

    if (!reporte) {
        throw new AppError('Reporte no encontrado', 404);
    }

    res.json(reporte);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_reporte = Number(req.params.id);
    const reporte = await buscarReportePorId(id_reporte);

    if (!reporte) {
        throw new AppError('Reporte no encontrado', 404);
    }

    const esDueno = reporte.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes editar un reporte que no es tuyo', 403);
    }

    const { tipo, especie, descripcion_fisica, ubicacion_suceso, fecha_suceso, estado } = req.body;
    await actualizarReporte(id_reporte, {
        tipo,
        especie,
        descripcion_fisica,
        ubicacion_suceso,
        fecha_suceso,
        estado,
    });

    res.json({ mensaje: 'Reporte actualizado' });
});

export const eliminar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_reporte = Number(req.params.id);
    const reporte = await buscarReportePorId(id_reporte);

    if (!reporte) {
        throw new AppError('Reporte no encontrado', 404);
    }

    const esDueno = reporte.id_usuario === req.usuario!.id_usuario;
    const esAdmin = req.usuario!.rol === 'ADMIN';

    if (!esDueno && !esAdmin) {
        throw new AppError('No puedes eliminar un reporte que no es tuyo', 403);
    }

    await eliminarReporte(id_reporte);
    res.json({ mensaje: 'Reporte eliminado' });
});