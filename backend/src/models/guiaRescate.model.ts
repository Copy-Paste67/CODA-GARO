import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface GuiaRescate extends RowDataPacket {
    id_guia: number;
    titulo: string;
    especie_objetivo: string;
    contenido_html: string;
    imagen_portada_url: string | null;
    autor_id: number | null;
    fecha_publicacion: Date;
}

interface Filtros {
    especie_objetivo?: string;
}

export const crearGuia = async (
    autor_id: number,
    titulo: string,
    especie_objetivo: string,
    contenido_html: string,
    imagen_portada_url?: string,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO guia_rescate (autor_id, titulo, especie_objetivo, contenido_html, imagen_portada_url)
         VALUES (?, ?, ?, ?, ?)`,
        [autor_id, titulo, especie_objetivo, contenido_html, imagen_portada_url ?? null],
    );

    return result.insertId;
};

export const listarGuias = async (filtros: Filtros): Promise<GuiaRescate[]> => {
    let query = `SELECT * FROM guia_rescate WHERE 1 = 1`;
    const params: string[] = [];

    if (filtros.especie_objetivo) {
        query += ` AND especie_objetivo = ?`;
        params.push(filtros.especie_objetivo);
    }

    query += ` ORDER BY fecha_publicacion DESC`;

    const [rows] = await pool.query<GuiaRescate[]>(query, params);
    return rows;
};

export const buscarGuiaPorId = async (id_guia: number): Promise<GuiaRescate | null> => {
    const [rows] = await pool.query<GuiaRescate[]>(
        `SELECT * FROM guia_rescate WHERE id_guia = ?`,
        [id_guia],
    );

    return rows[0] ?? null;
};

export const actualizarGuia = async (
    id_guia: number,
    titulo: string,
    especie_objetivo: string,
    contenido_html: string,
    imagen_portada_url?: string,
): Promise<void> => {
    await pool.query(
        `UPDATE guia_rescate
         SET titulo = ?, especie_objetivo = ?, contenido_html = ?, imagen_portada_url = ?
         WHERE id_guia = ?`,
        [titulo, especie_objetivo, contenido_html, imagen_portada_url ?? null, id_guia],
    );
};

export const eliminarGuia = async (id_guia: number): Promise<void> => {
    await pool.query(`DELETE FROM guia_rescate WHERE id_guia = ?`, [id_guia]);
};