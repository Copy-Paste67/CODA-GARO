import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Refugio extends RowDataPacket {
    id_refugio: number;
    id_usuario: number;
    nombre_refugio: string;
    direccion: string;
    descripcion: string | null;
    logo_url: string | null;
    datos_bancarios: string | null;
    verificado: boolean;
}

export const crearRefugio = async (
    id_usuario: number,
    nombre_refugio: string,
    direccion: string,
    descripcion?: string,
    logo_url?: string,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO refugio (id_usuario, nombre_refugio, direccion, descripcion, logo_url)
         VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, nombre_refugio, direccion, descripcion ?? null, logo_url ?? null],
    );

    return result.insertId;
};

export const listarRefugios = async (): Promise<Refugio[]> => {
    const [rows] = await pool.query<Refugio[]>(
        `SELECT id_refugio, id_usuario, nombre_refugio, direccion, descripcion, logo_url, verificado
         FROM refugio`,
    );

    return rows;
};

export const buscarRefugioPorId = async (id_refugio: number): Promise<Refugio | null> => {
    const [rows] = await pool.query<Refugio[]>(
        `SELECT * FROM refugio WHERE id_refugio = ?`,
        [id_refugio],
    );

    return rows[0] ?? null;
};

export const buscarRefugioPorUsuario = async (id_usuario: number): Promise<Refugio | null> => {
    const [rows] = await pool.query<Refugio[]>(
        `SELECT * FROM refugio WHERE id_usuario = ?`,
        [id_usuario],
    );

    return rows[0] ?? null;
};

export const actualizarRefugio = async (
    id_refugio: number,
    nombre_refugio: string,
    direccion: string,
    descripcion?: string,
    logo_url?: string,
): Promise<void> => {
    await pool.query(
        `UPDATE refugio SET nombre_refugio = ?, direccion = ?, descripcion = ?, logo_url = ?
         WHERE id_refugio = ?`,
        [nombre_refugio, direccion, descripcion ?? null, logo_url ?? null, id_refugio],
    );
};

export const eliminarRefugio = async (id_refugio: number): Promise<void> => {
    await pool.query(`DELETE FROM refugio WHERE id_refugio = ?`, [id_refugio]);
};

export const verificarRefugio = async (id_refugio: number, verificado: boolean): Promise<void> => {
    await pool.query(
        `UPDATE refugio SET verificado = ? WHERE id_refugio = ?`,
        [verificado, id_refugio],
    );
};