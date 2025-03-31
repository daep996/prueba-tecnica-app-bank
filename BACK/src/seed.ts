// src/seed.ts
import { AppDataSource } from "./config/data-source";
import { User } from "./entities/User";
import { Account } from "./entities/Account";
import { Transaction } from "./entities/Transaction";
import bcrypt from "bcryptjs";

async function seed() {
  await AppDataSource.initialize();
  console.log("🌱 Seed iniciado");

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Disable foreign key constraints
    // Truncate tables with CASCADE to handle foreign key constraints
    console.log("🗑️ Truncando tablas...");
    await queryRunner.query('TRUNCATE TABLE "transaction" CASCADE;');
    await queryRunner.query('TRUNCATE TABLE "account" CASCADE;');
    await queryRunner.query('TRUNCATE TABLE "user" CASCADE;');
    console.log("✅ Tablas truncadas correctamente");

    // Reset auto-increment IDs
    console.log("🔄 Reiniciando secuencias...");
    await queryRunner.query('ALTER SEQUENCE "transaction_id_seq" RESTART WITH 1;');
    await queryRunner.query('ALTER SEQUENCE "account_id_seq" RESTART WITH 1;');
    await queryRunner.query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1;');
    console.log("✅ Secuencias reiniciadas correctamente");

    const userRepo = AppDataSource.getRepository(User);
    const accountRepo = AppDataSource.getRepository(Account);
    const txRepo = AppDataSource.getRepository(Transaction);

    // Crear usuario de prueba
    const user1 = userRepo.create({
      email: "test1@example.com",
      password: await bcrypt.hash("test", 8),
    });

    const user2 = userRepo.create({
      email: "test2@example.com",
      password: await bcrypt.hash("test", 8),
    });
    await userRepo.save([user1, user2]);
    console.log("✅ Usuarios creados correctamente");

    // Crear cuentas bancarias de prueba
    const account1 = accountRepo.create({
      accountNumber: Math.random().toString().slice(2, 12),
      type: "ahorros",
      balance: 1500,
      user: user1,
    });

    const account2 = accountRepo.create({
      accountNumber: Math.random().toString().slice(2, 12),
      type: "corriente",
      balance: 500,
      user: user1,
    });

    const account3 = accountRepo.create({
      accountNumber: Math.random().toString().slice(2, 12),
      type: "ahorros",
      balance: 1400,
      user: user2,
    });

    const account4 = accountRepo.create({
      accountNumber: Math.random().toString().slice(2, 12),
      type: "corriente",
      balance: 400,
      user: user2,
    });

    await accountRepo.save([account1, account2, account3, account4]);
    console.log("✅ Cuentas creadas correctamente");

    // Crear transacciones de ejemplo
    /*
    const tx1 = txRepo.create({
        accountOrigin: account3,
        accountDestination: account1,
        amount: 1500,
        concept: 'Transferencia inicial',
        type: 'ingreso',
        userId: user2
    });

    const tx2 = txRepo.create({
        accountOrigin: account3,
        accountDestination: account2,
        amount: 500,
        concept: 'Transferencia inicial',
        type: 'ingreso',
        userId: user2
    });

    const tx3 = txRepo.create({
        accountOrigin: account4,
        accountDestination: account1,
        amount: 1400,
        concept: 'Transferencia inicial',
        type: 'ingreso',
        userId: user2
    });

    const tx4 = txRepo.create({
        accountOrigin: account4,
        accountDestination: account2,
        amount: 400,
        concept: 'Transferencia inicial',
        type: 'ingreso',
        userId: user2
    });

    await txRepo.save([tx1, tx2, tx3, tx4]);
    console.log('✅ Transacciones creadas correctamente');
    */

    console.log("✅ Seed ejecutado correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error ejecutando el seed:", error);
  } finally {
    await queryRunner.release();
    process.exit();
  }
}

seed();
