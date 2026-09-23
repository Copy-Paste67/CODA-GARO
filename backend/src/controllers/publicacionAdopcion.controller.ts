import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    crearPublicacion,
    listarPublicaciones,
    buscarPublicacionPorId,
    actualizarPublicacion,
    eliminarPublicacion,
} from '../models/publicacionAdopcion.model';

export const crear = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { nombre_animal, especie, raza_aparente, edad_aproximada, tamanio, descripcion } = req.body;

        if (!especie || !tamanio || !descripcion) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
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
    } catch (error) {
        console.error('Error al crear publicacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { especie, tamanio, estado } = req.query;
        const publicaciones = await listarPublicaciones({
            especie: especie as string,
            tamanio: tamanio as string,
            estado: estado as string,
        });

        res.json(publicaciones);
    } catch (error) {
        console.error('Error al listar publicaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerPorId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const publicacion = await buscarPublicacionPorId(Number(req.params.id));

        if (!publicacion) {
            res.status(404).json({ error: 'Publicación no encontrada' });
            return;
        }

        res.json(publicacion);
    } catch (error) {
        console.error('Error al obtener publicacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_adopcion = Number(req.params.id);
        const publicacion = await buscarPublicacionPorId(id_adopcion);

        if (!publicacion) {
            res.status(404).json({ error: 'Publicación no encontrada' });
            return;
        }

        const esDueno = publicacion.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes editar una publicación que no es tuya' });
            return;
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
    } catch (error) {
        console.error('Error al actualizar publicacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id_adopcion = Number(req.params.id);
        const publicacion = await buscarPublicacionPorId(id_adopcion);

        if (!publicacion) {
            res.status(404).json({ error: 'Publicación no encontrada' });
            return;
        }

        const esDueno = publicacion.id_usuario === req.usuario!.id_usuario;
        const esAdmin = req.usuario!.rol === 'ADMIN';

        if (!esDueno && !esAdmin) {
            res.status(403).json({ error: 'No puedes eliminar una publicación que no es tuya' });
            return;
        }

        await eliminarPublicacion(id_adopcion);
        res.json({ mensaje: 'Publicación eliminada' });
    } catch (error) {
        console.error('Error al eliminar publicacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};