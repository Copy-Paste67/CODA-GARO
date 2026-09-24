import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Imagen extends RowDataPacket {
    id_imagen: number;
    url_imagen: string;
    id_adopcion: number | null;
    id_reporte: number | null;
    fecha_subida: Date;
}

interface Filtros {
    id_adopcion?: number;
    id_reporte?: number;
}

export const crearImagen = async (
    url_imagen: string,
    id_adopcion: number | null,
    id_reporte: number | null,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO imagen (url_imagen, id_adopcion, id_reporte)
         VALUES (?, ?, ?)`,
        [url_imagen, id_adopcion, id_reporte],
    );

    return result.insertId;
};

export const listarImagenes = async (filtros: Filtros): Promise<Imagen[]> => {
    let query = `SELECT * FROM imagen WHERE 1 = 1`;
    const params: number[] = [];

    if (filtros.id_adopcion) {
        query += ` AND id_adopcion = ?`;
        params.push(filtros.id_adopcion);
    }

    if (filtros.id_reporte) {
        query += ` AND id_reporte = ?`;
        params.push(filtros.id_reporte);
    }

    query += ` ORDER BY fecha_subida DESC`;

    const [rows] = await pool.query<Imagen[]>(query, params);
    return rows;
};

export const buscarImagenPorId = async (id_imagen: number): Promise<Imagen | null> => {
    const [rows] = await pool.query<Imagen[]>(
        `SELECT * FROM imagen WHERE id_imagen = ?`,
        [id_imagen],
    );

    return rows[0] ?? null;
};

export const eliminarImagen = async (id_imagen: number): Promise<void> => {
    await pool.query(`DELETE FROM imagen WHERE id_imagen = ?`, [id_imagen]);
};