import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Usuario extends RowDataPacket {
    id_usuario: number;
    nombre_completo: string;
    email: string;
    password: string;
    telefono: string | null;
    rol: 'ADMIN' | 'REFUGIO' | 'RESCATISTA' | 'ADOPTANTE';
    foto_perfil_url: string | null;
    fecha_registro: Date;
    activo: boolean;
}

export const crearUsuario = async (
    nombre_completo: string,
    email: string,
    passwordHash: string,
    rol: string,
    telefono?: string,
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO usuario (nombre_completo, email, password, rol, telefono)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre_completo, email, passwordHash, rol, telefono ?? null],
    );

    return result.insertId;
};

export const buscarUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
    const [rows] = await pool.query<Usuario[]>(
        `SELECT * FROM usuario WHERE email = ?`,
        [email],
    );

    return rows[0] ?? null;
};