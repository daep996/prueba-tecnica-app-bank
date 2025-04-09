# prueba-tecnica-app-bank

prueba-tecnica-app-bank

Repo: https://github.com/daep996/prueba-tecnica-app-bank

Author: Diego Estrada (daep996)

## BACKEND

### IMAGEN DE DOCKER DE POSTGRES

- Subir el contenedor:
```bash
cd BACK
docker-compose up -d
```

- Bajar el contenedor:
```bash
cd BACK
docker-compose down
```

### MODELO DE BD POSTGRES

```postgres
-- Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hasheada aunque sea mock
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cuentas bancarias
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- "ahorros" | "corriente"
    balance NUMERIC(12,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_origin_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    account_destination_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL,
    concept VARCHAR(255),
    type VARCHAR(10) NOT NULL, -- "ingreso" | "gasto"
    created_at TIMESTAMP DEFAULT NOW()
);

```

### INSTALACIÓN PAQUETES BACK
```bash
cd BACK
npm i
```

### CREACIÓN DE UN SEED

Se puede generar un seed para que cree las tablas y data de prueba, se rcomienda la primera vez
```bash
npm run seed
```
### EJECUCIÓN

```bash
npm run dev
```

## FRONTEND

### INSTALACIÓN DE PAQUETES FRONT Y EJECUCIÓN
```bash
cd FRONT/ANGULAR
npm i
ng serve
```
