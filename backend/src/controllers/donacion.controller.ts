import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
    crearDonacion,
    listarDonaciones,
    buscarDonacionPorId,
    actualizarEstadoDonacion,
} from '../models/donacion.model';
import { buscarRefugioPorId } from '../models/refugio.model';

const METODOS_PAGO_VALIDOS = ['TARJETA', 'TRANSFERENCIA', 'PAYPAL'];
const ESTADOS_PAGO_VALIDOS = ['COMPLETADO', 'PENDIENTE', 'FALLIDO'];

// Función interna que valida y crea la donación (compartida por ambos endpoints)
const procesarDonacion = async (
    id_usuario: number | null,
    body: {
        id_refugio?: number;
        monto?: number | string;
        metodo_pago?: string;
        id_transaccion?: string;
    },
): Promise<{
    id_donacion: number;
    id_refugio: number;
    monto: number;
    metodo_pago: string;
}> => {
    const { id_refugio, monto, metodo_pago, id_transaccion } = body;

    if (!id_refugio || monto === undefined || !metodo_pago) {
        throw new AppError('Faltan campos obligatorios', 400);
    }

    const montoNum = Number(monto);

    if (isNaN(montoNum) || montoNum <= 0) {
        throw new AppError('El monto debe ser mayor a 0', 400);
    }

    if (!METODOS_PAGO_VALIDOS.includes(metodo_pago)) {
        throw new AppError('Método de pago inválido', 400);
    }

    const refugio = await buscarRefugioPorId(Number(id_refugio));

    if (!refugio) {
        throw new AppError('Refugio no encontrado', 404);
    }

    const id_donacion = await crearDonacion(
        id_usuario,
        Number(id_refugio),
        montoNum,
        metodo_pago,
        id_transaccion,
    );

    return {
        id_donacion,
        id_refugio: Number(id_refugio),
        monto: montoNum,
        metodo_pago,
    };
};

// POST /api/donaciones → donación autenticada (requiere token)
export const crear = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const resultado = await procesarDonacion(req.usuario!.id_usuario, req.body);

    res.status(201).json({
        ...resultado,
        id_usuario: req.usuario!.id_usuario,
        estado_pago: 'PENDIENTE',
    });
});

// POST /api/donaciones/anonima → donación anónima (sin token)
export const crearAnonima = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const resultado = await procesarDonacion(null, req.body);

    res.status(201).json({
        ...resultado,
        id_usuario: null,
        estado_pago: 'PENDIENTE',
    });
});

export const listar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id_refugio, id_usuario, estado_pago } = req.query;

    const esAdmin = req.usuario!.rol === 'ADMIN';

    const filtros: { id_refugio?: number; id_usuario?: number; estado_pago?: string } = {
        id_refugio: id_refugio ? Number(id_refugio) : undefined,
        estado_pago: estado_pago as string | undefined,
    };

    if (!esAdmin) {
        filtros.id_usuario = req.usuario!.id_usuario;
    } else if (id_usuario) {
        filtros.id_usuario = Number(id_usuario);
    }

    const donaciones = await listarDonaciones(filtros);
    res.json(donaciones);
});

export const obtenerPorId = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const donacion = await buscarDonacionPorId(Number(req.params.id));

    if (!donacion) {
        throw new AppError('Donación no encontrada', 404);
    }

    const esAdmin = req.usuario!.rol === 'ADMIN';
    const esDueno = donacion.id_usuario === req.usuario!.id_usuario;

    if (!esAdmin && !esDueno) {
        throw new AppError('No puedes ver una donación que no es tuya', 403);
    }

    res.json(donacion);
});

export const actualizar = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const id_donacion = Number(req.params.id);
    const donacion = await buscarDonacionPorId(id_donacion);

    if (!donacion) {
        throw new AppError('Donación no encontrada', 404);
    }

    const { estado_pago, id_transaccion } = req.body;

    if (!estado_pago || !ESTADOS_PAGO_VALIDOS.includes(estado_pago)) {
        throw new AppError('Estado de pago inválido', 400);
    }

    await actualizarEstadoDonacion(id_donacion, estado_pago, id_transaccion);
    res.json({ mensaje: 'Donación actualizada', estado_pago });
});