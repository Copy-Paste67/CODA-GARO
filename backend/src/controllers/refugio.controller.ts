import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    crearRefugio,
    listarRefugios,
    buscarRefugioPorId,
    buscarRefugioPorUsuario,
    actualizarRefugio,
    eliminarRefugio,
    verificarRefugio,
} from '../models/refugio.model';

export const crear = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { nombre_refugio, direccion, descripcion, logo_url } = req.body;
        const id_usuario = req.usuario!.id_usuario;

        if (!nombre_refugio || !direccion) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const refugioExistente = await buscarRefugioPorUsuario(id_usuario);

        if (refugioExistente) {
            res.status(409).json({ error: 'Este usuario ya tiene un refugio registrado' });
            return;
        }

        const id_refugio = await crearRefugio(id_usuario, nombre_refugio, direccion, descripcion, logo_url);
        res.status(201).json({ id_refugio, nombre_refugio, direccion });
    } catch (error) {
        console.error('Error al crear refugio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const refugios = await listarRefugios();
        res.json(refugios);
    } catch (error) {
        console.error('Error al listar refugios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerPorId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const refugio = await buscarRefugioPorId(Number(req.params.id));

        if (!refugio) {
            res.status(404).json({ error: 'Refugio no encontrado' });
            return;
        }

        res.json(refugio);
    } catch (error) {
        console.error('Error al obtener refugio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_refugio = Number(req.params.id);
        const refugio = await buscarRefugioPorId(id_refugio);

        if (!refugio) {
            res.status(404).json({ error: 'Refugio no encontrado' });
            return;
        }

        const esDueno = refugio.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes editar un refugio que no es tuyo' });
            return;
        }

        const { nombre_refugio, direccion, descripcion, logo_url } = req.body;
        await actualizarRefugio(id_refugio, nombre_refugio, direccion, descripcion, logo_url);
        res.json({ mensaje: 'Refugio actualizado' });
    } catch (error) {
        console.error('Error al actualizar refugio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_refugio = Number(req.params.id);
        const refugio = await buscarRefugioPorId(id_refugio);

        if (!refugio) {
            res.status(404).json({ error: 'Refugio no encontrado' });
            return;
        }

        const esDueno = refugio.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes eliminar un refugio que no es tuyo' });
            return;
        }

        await eliminarRefugio(id_refugio);
        res.json({ mensaje: 'Refugio eliminado' });
    } catch (error) {
        console.error('Error al eliminar refugio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const verificar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_refugio = Number(req.params.id);
        const refugio = await buscarRefugioPorId(id_refugio);

        if (!refugio) {
            res.status(404).json({ error: 'Refugio no encontrado' });
            return;
        }

        const { verificado } = req.body;

        if (typeof verificado !== 'boolean') {
            res.status(400).json({ error: 'El campo verificado debe ser true o false' });
            return;
        }

        await verificarRefugio(id_refugio, verificado);
        res.json({ mensaje: `Refugio ${verificado ? 'verificado' : 'desverificado'} correctamente` });
    } catch (error) {
        console.error('Error al verificar refugio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};