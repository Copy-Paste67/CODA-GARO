import 'dotenv/config';

const required = (name: string): string => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Falta la variable ${name}`);
    }

    return value;
};

export const env = {
    port: Number(process.env.PORT ?? 3000),

    db: {
        host: required('DB_HOST'),
        port: Number(process.env.DB_PORT ?? 3307),
        database: required('DB_NAME'),
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
    },

    jwtSecret: required('JWT_SECRET'),
};