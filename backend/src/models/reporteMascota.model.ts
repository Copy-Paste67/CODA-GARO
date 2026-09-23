import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface ReporteMascota extends RowDataPacket {
    id_reporte: number;
    id_usuario: number;
    tipo: 'PERDIDO' | 'ENCONTRADO';
    especie: 'PERRO' | 'GATO' | 'AVE' | 'OTRO';
    descripcion_fisica: string;
    ubicacion_suceso: string;
    fecha_suceso: Date;
    estado: 'BUSCANDO' | 'RESUELTO';
    fecha_creacion: Date;
}

interface Filtros {
    tipo?: string;
    especie?: string;
    estado?: string;
}

export const crearReporte = async (
    id_usuario: number,
    datos: {
        tipo: string;
        especie: string;
        descripcion_fisica: string;
        ubicacion_suceso: string;
        fecha_suceso: string;
    },
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO reporte_mascota
         (id_usuario, tipo, especie, descripcion_fisica, ubicacion_suceso, fecha_suceso)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            id_usuario,
            datos.tipo,
            datos.especie,
            datos.descripcion_fisica,
            datos.ubicacion_suceso,
            datos.fecha_suceso,
        ],
    );

    return result.insertId;
};

export const listarReportes = async (filtros: Filtros): Promise<ReporteMascota[]> => {
    let query = `SELECT * FROM reporte_mascota WHERE 1 = 1`;
    const params: string[] = [];

    if (filtros.tipo) {
        query += ` AND tipo = ?`;
        params.push(filtros.tipo);
    }

    if (filtros.especie) {
        query += ` AND especie = ?`;
        params.push(filtros.especie);
    }

    if (filtros.estado) {
        query += ` AND estado = ?`;
        params.push(filtros.estado);
    }

    query += ` ORDER BY fecha_creacion DESC`;

    const [rows] = await pool.query<ReporteMascota[]>(query, params);
    return rows;
};

export const buscarReportePorId = async (id_reporte: number): Promise<ReporteMascota | null> => {
    const [rows] = await pool.query<ReporteMascota[]>(
        `SELECT * FROM reporte_mascota WHERE id_reporte = ?`,
        [id_reporte],
    );

    return rows[0] ?? null;
};

export const actualizarReporte = async (
    id_reporte: number,
    datos: {
        tipo: string;
        especie: string;
        descripcion_fisica: string;
        ubicacion_suceso: string;
        fecha_suceso: string;
        estado: string;
    },
): Promise<void> => {
    await pool.query(
        `UPDATE reporte_mascota
         SET tipo = ?, especie = ?, descripcion_fisica = ?, ubicacion_suceso = ?,
             fecha_suceso = ?, estado = ?
         WHERE id_reporte = ?`,
        [
            datos.tipo,
            datos.especie,
            datos.descripcion_fisica,
            datos.ubicacion_suceso,
            datos.fecha_suceso,
            datos.estado,
            id_reporte,
        ],
    );
};

export const eliminarReporte = async (id_reporte: number): Promise<void> => {
    await pool.query(`DELETE FROM reporte_mascota WHERE id_reporte = ?`, [id_reporte]);
};