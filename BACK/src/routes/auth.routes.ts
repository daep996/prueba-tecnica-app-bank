import { Router, Request, Response } from 'express';

import { login, register } from '../controllers/auth.controller';

const router = Router()

// Registro de usuario
router.post('/register', async (req: Request, res: Response): Promise<any> => {
    register(req, res)
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    login(req, res)
});

export default router;
