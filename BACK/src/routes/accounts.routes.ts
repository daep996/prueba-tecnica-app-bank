import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { User } from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const accountRepo = AppDataSource.getRepository(Account);
const userRepo = AppDataSource.getRepository(User);

router.use(authMiddleware);

// Listar cuentas
router.get('/', async (req: Request, res: Response): Promise<any> => {
    const accounts = await accountRepo.find({ where: { user: { id: req.body.userId } } });
    return res.json(accounts);
});

// Crear cuenta
router.post('/', async (req: Request, res: Response): Promise<any> => {
    const { type, balance } = req.body as { type: string; balance: number };
    const user = await userRepo.findOneBy({ id: req.body.userId });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const account = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type,
        user,
        balance: isNaN(balance) ? 0 : balance,
    });

    await accountRepo.save(account);
    return res.json(account);
});

// Ver detalle de una cuenta
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    const account = await accountRepo.findOne({
        where: { id: req.params.id, user: { id: req.body.userId } },
    });
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });
    return res.json(account);
});

router.get('/user/:id', async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id ??  ''
    const user = await userRepo.findOneBy({ id })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const userAccounts = await accountRepo.find({
        where: {
            user: { id }
        }
    })
    return res.json(userAccounts)
})

export default router;
