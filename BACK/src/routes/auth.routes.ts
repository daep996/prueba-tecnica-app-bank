import { Router } from 'express';
import type { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { JwtService } from '../utils/jwt';

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Registro de usuario
router.post('/register', async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = userRepo.create({ email, password: hashedPassword });
    await userRepo.save(user);
    return res.json({ message: 'Usuario registrado' });
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const user = await userRepo.findOneBy({ 'email': email });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = JwtService.sign({userId: user.id});
    return res.json({ token });
});

export default router;
