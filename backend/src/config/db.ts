import mysql from 'mysql2/promise';
import { env } from './env';

export const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const testConnection = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();

        console.log('Conexión a MySQL exitosa');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a MySQL:', error);
        process.exit(1);
    }
};