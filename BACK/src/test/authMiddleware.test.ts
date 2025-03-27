import express from 'express';
import request from 'supertest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { JwtService } from '../utils/jwt';

const app = express();
app.use(express.json());

// Protected route
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Access granted' });
});

describe('authMiddleware', () => {

    it('should block without token', async () => {
        const res = await request(app).get('/protected');
        expect(res.status).toBe(401);
    });

    it('should block with invalid token', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
    });

    it('should allow with valid token', async () => {
        const token = JwtService.sign({ userId: 1 });
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Access granted');
    });
});
