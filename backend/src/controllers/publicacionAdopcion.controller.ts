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

const ESPECIES_VALIDAS = ['PERRO', 'GATO', 'AVE', 'OTRO'];
const TAMANIOS_VALIDOS = ['PEQUENO', 'MEDIANO', 'GRANDE'];
const ESTADOS_VALIDOS = ['DISPONIBLE', 'EN_TRAMITE', 'ADOPTADO'];

export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { nombre_animal, especie, raza_aparente, edad_aproximada, tamanio, descripcion } = req.body;

    if (!especie || !tamanio || !descripcion) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const especieUpper = String(especie).trim().toUpperCase();
    const tamanioUpper = String(tamanio).trim().toUpperCase();

    if (!ESPECIES_VALIDAS.includes(especieUpper)) {
        throw new AppError('Especie inválida. Debe ser PERRO, GATO, AVE u OTRO', 400);
    }

    if (!TAMANIOS_VALIDOS.includes(tamanioUpper)) {
        throw new AppError('Tamaño inválido. Debe ser PEQUENO, MEDIANO o GRANDE', 400);
    }

    const id_adopcion = await crearPublicacion(req.usuario!.id_usuario, {
        nombre_animal,
        especie: especieUpper,
        raza_aparente,
        edad_aproximada,
        tamanio: tamanioUpper,
        descripcion,
    });

    res.status(201).json({ id_adopcion, especie: especieUpper, tamanio: tamanioUpper, descripcion, estado: 'DISPONIBLE' });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { especie, tamanio, estado } = req.query;
    const publicaciones = await listarPublicaciones({
        especie: especie ? String(especie).toUpperCase() : undefined,
        tamanio: tamanio ? String(tamanio).toUpperCase() : undefined,
        estado: estado ? String(estado).toUpperCase() : undefined,
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

    const especieUpper = especie ? String(especie).trim().toUpperCase() : publicacion.especie;
    const tamanioUpper = tamanio ? String(tamanio).trim().toUpperCase() : publicacion.tamanio;
    const estadoUpper = estado ? String(estado).trim().toUpperCase() : publicacion.estado;

    if (!ESPECIES_VALIDAS.includes(especieUpper)) {
        throw new AppError('Especie inválida. Debe ser PERRO, GATO, AVE u OTRO', 400);
    }
    if (!TAMANIOS_VALIDOS.includes(tamanioUpper)) {
        throw new AppError('Tamaño inválido. Debe ser PEQUENO, MEDIANO o GRANDE', 400);
    }
    if (!ESTADOS_VALIDOS.includes(estadoUpper)) {
        throw new AppError('Estado inválido. Debe ser DISPONIBLE, EN_TRAMITE o ADOPTADO', 400);
    }

    await actualizarPublicacion(id_adopcion, {
        nombre_animal: nombre_animal ?? publicacion.nombre_animal,
        especie: especieUpper,
        raza_aparente: raza_aparente ?? publicacion.raza_aparente,
        edad_aproximada: edad_aproximada ?? publicacion.edad_aproximada,
        tamanio: tamanioUpper,
        descripcion: descripcion ?? publicacion.descripcion,
        estado: estadoUpper,
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