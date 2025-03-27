import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from '../entities/User';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost', // para local
    // host: 'db', // como se llama el servicio en docker-compose
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    entities: [User, Account, Transaction],
});
