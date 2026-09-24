import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Donacion extends RowDataPacket {
    id_donacion: number;
    id_usuario: number | null;
    id_refugio: number;
    monto: number;
    metodo_pago: 'TARJETA' | 'TRANSFERENCIA' | 'PAYPAL';
    id_transaccion: string | null;
    estado_pago: 'COMPLETADO' | 'PENDIENTE' | 'FALLIDO';
    fecha_donacion: Date;
}

interface Filtros {
    id_refugio?: number;
    id_usuario?: number;
    estado_pago?: string;
}

export const crearDonacion = async (
    id_usuario: number | null,
    id_refugio: number,
    monto: number,
    metodo_pago: string,
    id_transaccion?: string,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO donacion (id_usuario, id_refugio, monto, metodo_pago, id_transaccion)
         VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_refugio, monto, metodo_pago, id_transaccion ?? null],
    );

    return result.insertId;
};

export const listarDonaciones = async (filtros: Filtros): Promise<Donacion[]> => {
    let query = `SELECT * FROM donacion WHERE 1 = 1`;
    const params: (number | string)[] = [];

    if (filtros.id_refugio) {
        query += ` AND id_refugio = ?`;
        params.push(filtros.id_refugio);
    }

    if (filtros.id_usuario) {
        query += ` AND id_usuario = ?`;
        params.push(filtros.id_usuario);
    }

    if (filtros.estado_pago) {
        query += ` AND estado_pago = ?`;
        params.push(filtros.estado_pago);
    }

    query += ` ORDER BY fecha_donacion DESC`;

    const [rows] = await pool.query<Donacion[]>(query, params);
    return rows;
};

export const buscarDonacionPorId = async (id_donacion: number): Promise<Donacion | null> => {
    const [rows] = await pool.query<Donacion[]>(
        `SELECT * FROM donacion WHERE id_donacion = ?`,
        [id_donacion],
    );

    return rows[0] ?? null;
};

export const actualizarEstadoDonacion = async (
    id_donacion: number,
    estado_pago: string,
    id_transaccion?: string,
): Promise<void> => {
    await pool.query(
        `UPDATE donacion SET estado_pago = ?, id_transaccion = COALESCE(?, id_transaccion)
         WHERE id_donacion = ?`,
        [estado_pago, id_transaccion ?? null, id_donacion],
    );
};