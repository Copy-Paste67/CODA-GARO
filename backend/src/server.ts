import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';

const start = async (): Promise<void> => {
    try {
        await testConnection();

        app.listen(env.port, () => {
            console.log(`Servidor corriendo en http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

start();