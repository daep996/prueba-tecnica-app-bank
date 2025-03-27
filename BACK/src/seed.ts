// src/seed.ts
import { AppDataSource } from './config/data-source';
import { User } from './entities/User';
import { Account } from './entities/Account';
import { Transaction } from './entities/Transaction';
import bcrypt from 'bcryptjs';

async function seed() {
    await AppDataSource.initialize();
    console.log('🌱 Seed iniciado');

    const userRepo = AppDataSource.getRepository(User);
    const accountRepo = AppDataSource.getRepository(Account);
    const txRepo = AppDataSource.getRepository(Transaction);

    // Verificar si ya existe el usuario
    let existing = await userRepo.findOneBy({ email: 'test1@example.com' });
    if (existing) {
        console.log('⚠️ Ya existe un usuario de prueba. Seed no es necesario.');
    }

    // Crear usuario de prueba
    const user1 = userRepo.create({
        email: 'test1@example.com',
        password: await bcrypt.hash('test', 8),
    });
    await userRepo.save(user1);

    // Verificar si ya existe el usuario
    existing = await userRepo.findOneBy({ email: 'test2@example.com' });
    if (existing) {
        console.log('⚠️ Ya existe un usuario de prueba. Seed no es necesario.');
    }

    // Crear usuario de prueba
    const user2 = userRepo.create({
        email: 'test2@example.com',
        password: await bcrypt.hash('test', 8),
    });
    await userRepo.save(user2);

    // Crear cuentas bancarias de prueba
    const account1 = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type: 'ahorros',
        balance: 1500,
        user: user1,
    });

    const account2 = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type: 'corriente',
        balance: 500,
        user: user1,
    });
    // Crear cuentas bancarias de prueba
    const account3 = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type: 'ahorros',
        balance: 1400,
        user: user2,
    });

    const account4 = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type: 'corriente',
        balance: 400,
        user: user2,
    });

    await accountRepo.save([account1, account2, account3, account4]);

    // Crear transacciones de ejemplo
    const tx1 = txRepo.create({
        accountOrigin: account1,
        accountDestination: account3,
        amount: 200,
        concept: 'Transferencia inicial',
        type: 'gasto',
    });

    const tx2 = txRepo.create({
        accountOrigin: account2,
        accountDestination: account4,
        amount: 100,
        concept: 'Reembolso',
        type: 'gasto',
    });

    await txRepo.save([tx1, tx2]);

    console.log('✅ Seed ejecutado correctamente');
    process.exit();
}

seed();
