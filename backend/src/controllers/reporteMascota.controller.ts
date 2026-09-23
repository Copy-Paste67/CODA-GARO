import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    crearReporte,
    listarReportes,
    buscarReportePorId,
    actualizarReporte,
    eliminarReporte,
} from '../models/reporteMascota.model';

export const crear = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { tipo, especie, descripcion_fisica, ubicacion_suceso, fecha_suceso } = req.body;

        if (!tipo || !especie || !descripcion_fisica || !ubicacion_suceso || !fecha_suceso) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const id_reporte = await crearReporte(req.usuario!.id_usuario, {
            tipo,
            especie,
            descripcion_fisica,
            ubicacion_suceso,
            fecha_suceso,
        });

        res.status(201).json({ id_reporte, tipo, especie, estado: 'BUSCANDO' });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { tipo, especie, estado } = req.query;
        const reportes = await listarReportes({
            tipo: tipo as string,
            especie: especie as string,
            estado: estado as string,
        });

        res.json(reportes);
    } catch (error) {
        console.error('Error al listar reportes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerPorId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reporte = await buscarReportePorId(Number(req.params.id));

        if (!reporte) {
            res.status(404).json({ error: 'Reporte no encontrado' });
            return;
        }

        res.json(reporte);
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_reporte = Number(req.params.id);
        const reporte = await buscarReportePorId(id_reporte);

        if (!reporte) {
            res.status(404).json({ error: 'Reporte no encontrado' });
            return;
        }

        const esDueno = reporte.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes editar un reporte que no es tuyo' });
            return;
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
    } catch (error) {
        console.error('Error al actualizar reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_reporte = Number(req.params.id);
        const reporte = await buscarReportePorId(id_reporte);

        if (!reporte) {
            res.status(404).json({ error: 'Reporte no encontrado' });
            return;
        }

        const esDueno = reporte.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes eliminar un reporte que no es tuyo' });
            return;
        }

        await eliminarReporte(id_reporte);
        res.json({ mensaje: 'Reporte eliminado' });
    } catch (error) {
        console.error('Error al eliminar reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};