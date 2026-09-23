import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';

const start = async (): Promise<void> => {
    await testConnection();

    app.listen(env.port, () => {
        console.log(`Servidor corriendo en http://localhost:${env.port}`);
    });
};

start();