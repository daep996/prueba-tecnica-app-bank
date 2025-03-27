import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import authRouter from '../routes/auth.routes';
import { AppDataSource } from '../config/data-source';

// Preparamos app simulada
const app = express();
app.use(bodyParser.json());
app.use('/auth', authRouter);

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe('Auth Controller', () => {
    const user = { email: 'test@test.com', password: 'test' };

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: user.email, password: 'wrongpass' });

        expect(res.status).toBe(401);
    });
});
