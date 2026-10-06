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

const TIPOS_VALIDOS = ['PERDIDO', 'ENCONTRADO'];
const ESPECIES_VALIDAS = ['PERRO', 'GATO', 'AVE', 'OTRO'];
const ESTADOS_VALIDOS = ['BUSCANDO', 'RESUELTO'];

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { tipo, especie, descripcion_fisica, ubicacion_suceso, telefono_contacto, fecha_suceso } = req.body;

    if (!tipo || !especie || !descripcion_fisica || !ubicacion_suceso || !fecha_suceso) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const tipoUpper = String(tipo).trim().toUpperCase();
    const especieUpper = String(especie).trim().toUpperCase();

    if (!TIPOS_VALIDOS.includes(tipoUpper)) {
        throw new AppError('Tipo de reporte inválido. Debe ser PERDIDO o ENCONTRADO', 400);
    }

    if (!ESPECIES_VALIDAS.includes(especieUpper)) {
        throw new AppError('Especie inválida. Debe ser PERRO, GATO, AVE u OTRO', 400);
    }

    const id_reporte = await crearReporte(req.usuario!.id_usuario, {
        tipo: tipoUpper,
        especie: especieUpper,
        descripcion_fisica,
        ubicacion_suceso,
        telefono_contacto,
        fecha_suceso,
    });

    res.status(201).json({ id_reporte, tipo: tipoUpper, especie: especieUpper, estado: 'BUSCANDO' });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { tipo, especie, estado } = req.query;
    const reportes = await listarReportes({
        tipo: tipo ? String(tipo).toUpperCase() : undefined,
        especie: especie ? String(especie).toUpperCase() : undefined,
        estado: estado ? String(estado).toUpperCase() : undefined,
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

    const { tipo, especie, descripcion_fisica, ubicacion_suceso, telefono_contacto, fecha_suceso, estado } = req.body;

    const tipoUpper = tipo ? String(tipo).trim().toUpperCase() : reporte.tipo;
    const especieUpper = especie ? String(especie).trim().toUpperCase() : reporte.especie;
    const estadoUpper = estado ? String(estado).trim().toUpperCase() : reporte.estado;

    if (!TIPOS_VALIDOS.includes(tipoUpper)) {
        throw new AppError('Tipo de reporte inválido. Debe ser PERDIDO o ENCONTRADO', 400);
    }
    if (!ESPECIES_VALIDAS.includes(especieUpper)) {
        throw new AppError('Especie inválida. Debe ser PERRO, GATO, AVE u OTRO', 400);
    }
    if (!ESTADOS_VALIDOS.includes(estadoUpper)) {
        throw new AppError('Estado inválido. Debe ser BUSCANDO o RESUELTO', 400);
    }

    await actualizarReporte(id_reporte, {
        tipo: tipoUpper,
        especie: especieUpper,
        descripcion_fisica: descripcion_fisica ?? reporte.descripcion_fisica,
        ubicacion_suceso: ubicacion_suceso ?? reporte.ubicacion_suceso,
        telefono_contacto: telefono_contacto ?? reporte.telefono_contacto ?? undefined,
        fecha_suceso: fecha_suceso ?? reporte.fecha_suceso,
        estado: estadoUpper,
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