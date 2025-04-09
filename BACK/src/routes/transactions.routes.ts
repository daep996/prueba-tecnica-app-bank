import { Router, Request, Response } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { accountsDetail, accountsDetails, accountsDetailsByUser, createTransaction } from '../controllers/transactions.controller';

const router = Router()

router.use(authMiddleware)

// Crear transferencia
router.post('/', async (req: Request, res: Response): Promise<any> => {
    createTransaction(req, res)
});

// Detalle de transacción
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    accountsDetail(req, res)
});

// Detalle de transacciones usuario
router.get('/user/:id', async (req: Request, res: Response): Promise<any> => {
    accountsDetailsByUser(req, res)
});

// Detalle de transacciones mi cuenta
router.get('/account/:id', async (req: Request, res: Response): Promise<any> => {
    accountsDetails(req, res)
})

export default router;
