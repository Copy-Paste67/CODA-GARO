import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Comentario extends RowDataPacket {
    id_comentario: number;
    id_usuario: number;
    id_adopcion: number | null;
    id_reporte: number | null;
    contenido: string;
    fecha_hora: Date;
}

interface Filtros {
    id_adopcion?: number;
    id_reporte?: number;
}

export const crearComentario = async (
    id_usuario: number,
    contenido: string,
    id_adopcion: number | null,
    id_reporte: number | null,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO comentario (id_usuario, contenido, id_adopcion, id_reporte)
         VALUES (?, ?, ?, ?)`,
        [id_usuario, contenido, id_adopcion, id_reporte],
    );

    return result.insertId;
};

export const listarComentarios = async (filtros: Filtros): Promise<Comentario[]> => {
    let query = `SELECT * FROM comentario WHERE 1 = 1`;
    const params: number[] = [];

    if (filtros.id_adopcion) {
        query += ` AND id_adopcion = ?`;
        params.push(filtros.id_adopcion);
    }

    if (filtros.id_reporte) {
        query += ` AND id_reporte = ?`;
        params.push(filtros.id_reporte);
    }

    query += ` ORDER BY fecha_hora DESC`;

    const [rows] = await pool.query<Comentario[]>(query, params);
    return rows;
};

export const buscarComentarioPorId = async (id_comentario: number): Promise<Comentario | null> => {
    const [rows] = await pool.query<Comentario[]>(
        `SELECT * FROM comentario WHERE id_comentario = ?`,
        [id_comentario],
    );

    return rows[0] ?? null;
};

export const actualizarComentario = async (
    id_comentario: number,
    contenido: string,
): Promise<void> => {
    await pool.query(
        `UPDATE comentario SET contenido = ? WHERE id_comentario = ?`,
        [contenido, id_comentario],
    );
};

export const eliminarComentario = async (id_comentario: number): Promise<void> => {
    await pool.query(`DELETE FROM comentario WHERE id_comentario = ?`, [id_comentario]);
};