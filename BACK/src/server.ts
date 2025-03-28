import express from 'express';
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/accounts.routes';
import transactionRoutes from './routes/transactions.routes';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors())

app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

export default app;
