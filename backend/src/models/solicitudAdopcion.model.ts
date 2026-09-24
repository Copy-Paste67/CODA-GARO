import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface SolicitudAdopcion extends RowDataPacket {
    id_solicitud: number;
    id_adopcion: number;
    id_adoptante: number;
    estado: string;
    mensaje: string | null;
    fecha_solicitud: Date;
}

interface Filtros {
    id_adopcion?: number;
    id_adoptante?: number;
    estado?: string;
}

export const crearSolicitud = async (
    id_adopcion: number,
    id_adoptante: number,
    mensaje?: string,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO solicitud_adopcion (id_adopcion, id_adoptante, mensaje)
         VALUES (?, ?, ?)`,
        [id_adopcion, id_adoptante, mensaje ?? null],
    );

    return result.insertId;
};

export const listarSolicitudes = async (filtros: Filtros): Promise<SolicitudAdopcion[]> => {
    let query = `SELECT * FROM solicitud_adopcion WHERE 1 = 1`;
    const params: (number | string)[] = [];

    if (filtros.id_adopcion) {
        query += ` AND id_adopcion = ?`;
        params.push(filtros.id_adopcion);
    }

    if (filtros.id_adoptante) {
        query += ` AND id_adoptante = ?`;
        params.push(filtros.id_adoptante);
    }

    if (filtros.estado) {
        query += ` AND estado = ?`;
        params.push(filtros.estado);
    }

    query += ` ORDER BY fecha_solicitud DESC`;

    const [rows] = await pool.query<SolicitudAdopcion[]>(query, params);
    return rows;
};

export const buscarSolicitudPorId = async (id_solicitud: number): Promise<SolicitudAdopcion | null> => {
    const [rows] = await pool.query<SolicitudAdopcion[]>(
        `SELECT * FROM solicitud_adopcion WHERE id_solicitud = ?`,
        [id_solicitud],
    );

    return rows[0] ?? null;
};

export const buscarSolicitudPorAdopcionYAdoptante = async (
    id_adopcion: number,
    id_adoptante: number,
): Promise<SolicitudAdopcion | null> => {
    const [rows] = await pool.query<SolicitudAdopcion[]>(
        `SELECT * FROM solicitud_adopcion WHERE id_adopcion = ? AND id_adoptante = ?`,
        [id_adopcion, id_adoptante],
    );

    return rows[0] ?? null;
};

export const actualizarEstadoSolicitud = async (
    id_solicitud: number,
    estado: string,
): Promise<void> => {
    await pool.query(
        `UPDATE solicitud_adopcion SET estado = ? WHERE id_solicitud = ?`,
        [estado, id_solicitud],
    );
};

export const eliminarSolicitud = async (id_solicitud: number): Promise<void> => {
    await pool.query(`DELETE FROM solicitud_adopcion WHERE id_solicitud = ?`, [id_solicitud]);
};