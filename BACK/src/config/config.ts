// src/config.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        port: Number(process.env.PORT) || 3000,
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'bank_app',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};
