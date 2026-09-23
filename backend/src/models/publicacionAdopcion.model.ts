import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface PublicacionAdopcion extends RowDataPacket {
    id_adopcion: number;
    id_usuario: number;
    nombre_animal: string | null;
    especie: 'PERRO' | 'GATO' | 'AVE' | 'OTRO';
    raza_aparente: string | null;
    edad_aproximada: string | null;
    tamanio: 'PEQUENO' | 'MEDIANO' | 'GRANDE';
    descripcion: string;
    estado: 'DISPONIBLE' | 'EN_TRAMITE' | 'ADOPTADO';
    fecha_creacion: Date;
}

interface Filtros {
    especie?: string;
    tamanio?: string;
    estado?: string;
}

export const crearPublicacion = async (
    id_usuario: number,
    datos: {
        nombre_animal?: string;
        especie: string;
        raza_aparente?: string;
        edad_aproximada?: string;
        tamanio: string;
        descripcion: string;
    },
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO publicacion_adopcion
         (id_usuario, nombre_animal, especie, raza_aparente, edad_aproximada, tamanio, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id_usuario,
            datos.nombre_animal ?? null,
            datos.especie,
            datos.raza_aparente ?? null,
            datos.edad_aproximada ?? null,
            datos.tamanio,
            datos.descripcion,
        ],
    );

    return result.insertId;
};

export const listarPublicaciones = async (filtros: Filtros): Promise<PublicacionAdopcion[]> => {
    let query = `SELECT * FROM publicacion_adopcion WHERE 1 = 1`;
    const params: string[] = [];

    if (filtros.especie) {
        query += ` AND especie = ?`;
        params.push(filtros.especie);
    }

    if (filtros.tamanio) {
        query += ` AND tamanio = ?`;
        params.push(filtros.tamanio);
    }

    if (filtros.estado) {
        query += ` AND estado = ?`;
        params.push(filtros.estado);
    }

    query += ` ORDER BY fecha_creacion DESC`;

    const [rows] = await pool.query<PublicacionAdopcion[]>(query, params);
    return rows;
};

export const buscarPublicacionPorId = async (id_adopcion: number): Promise<PublicacionAdopcion | null> => {
    const [rows] = await pool.query<PublicacionAdopcion[]>(
        `SELECT * FROM publicacion_adopcion WHERE id_adopcion = ?`,
        [id_adopcion],
    );

    return rows[0] ?? null;
};

export const actualizarPublicacion = async (
    id_adopcion: number,
    datos: {
        nombre_animal?: string;
        especie: string;
        raza_aparente?: string;
        edad_aproximada?: string;
        tamanio: string;
        descripcion: string;
        estado: string;
    },
): Promise<void> => {
    await pool.query(
        `UPDATE publicacion_adopcion
         SET nombre_animal = ?, especie = ?, raza_aparente = ?, edad_aproximada = ?,
             tamanio = ?, descripcion = ?, estado = ?
         WHERE id_adopcion = ?`,
        [
            datos.nombre_animal ?? null,
            datos.especie,
            datos.raza_aparente ?? null,
            datos.edad_aproximada ?? null,
            datos.tamanio,
            datos.descripcion,
            datos.estado,
            id_adopcion,
        ],
    );
};

export const eliminarPublicacion = async (id_adopcion: number): Promise<void> => {
    await pool.query(`DELETE FROM publicacion_adopcion WHERE id_adopcion = ?`, [id_adopcion]);
};