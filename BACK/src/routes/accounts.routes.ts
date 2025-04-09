import { Router, Request, Response } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { accountDetails, accountsByUser, createAccount } from '../controllers/account.controller';

const router = Router();

router.use(authMiddleware);

// Crear cuenta
router.post('/', async (req: Request, res: Response): Promise<any> => {
    createAccount(req, res)
})

// Ver detalle de una cuenta
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    accountDetails(req, res)
})

// Ver las cuentas del usuario
router.get('/user/:id', async (req: Request, res: Response): Promise<any> => {
    accountsByUser(req, res)
})

export default router;
