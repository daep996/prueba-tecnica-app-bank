import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Account } from '../entities/Account';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const txRepo = AppDataSource.getRepository(Transaction);
const accountRepo = AppDataSource.getRepository(Account);

router.use(authMiddleware);

// Listar transacciones
router.get('/', async (req: Request, res: Response) : Promise<any> => {
    const { accountId, type } = req.query
    const filters: any = {}

    if (accountId) filters.accountOrigin = { id: parseInt(accountId as string) }
    if (type) filters.type = type

    const transactions = await txRepo.find({
        where: filters,
        relations: ['accountOrigin', 'accountDestination'],
    })

    return res.json(transactions)
});

// Crear transferencia
router.post('/', async (req: Request, res: Response): Promise<any> => {
    const { accountOriginId, accountDestinationId, amount, concept } = req.body
    
    if (accountOriginId === accountDestinationId)
        return res.status(400).json({ message: 'No puedes transferir a la misma cuenta' })
    
    const parsedAmount = parseFloat(amount)
    
    if (isNaN(parsedAmount)) return res.status(400).json({ message: 'Monto inválido' })
    if (parsedAmount <= 0) return res.status(400).json({ message: 'El monto debe ser positivo' })

    const origin = await accountRepo.findOne({
        where: { accountNumber: accountOriginId, user: { id: req.body.userId } },
    });

    const destination = await accountRepo.findOneBy({ accountNumber: accountDestinationId })

    if (!origin || !destination) return res.status(404).json({ message: 'Cuenta no encontrada' })
    if (origin.balance < parsedAmount) return res.status(400).json({ message: 'Saldo insuficiente' })

    origin.balance = Number(origin.balance) - parsedAmount
    destination.balance = Number(destination.balance) + parsedAmount

    const tx = txRepo.create({
        accountOrigin: origin,
        accountDestination: destination,
        amount: parsedAmount,
        concept,
        type: 'gasto',
        user: req.body.userId
    })

    await accountRepo.save([origin, destination])
    await txRepo.save(tx)

    return res.json({ message: `Transferencia realizada: ${tx.id} - ${new Date(tx.created_at).toISOString()}` })
});

// Detalle de transacción
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    const tx = await txRepo.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['accountOrigin', 'accountDestination'],
    })
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
    return res.json(tx)
});

// Detalle de transacciones usuario
router.get('/user/:id', async (req: Request, res: Response): Promise<any> => {
    const tx = await txRepo.find({
        select: {id: true, amount: true, concept: true, 'type': true, 'created_at': true},
        where: { user: { id: req.params.id } },
    })
    console.log(`tx: ${JSON.stringify(tx)}`)
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
    return res.json(tx)
});

// Detalle de transacciones mi cuenta
router.get('/account/:id', async (req: Request, res: Response): Promise<any> => {
    const tx = await txRepo.find({
        select: {id: true, amount: true, concept: true, 'type': true, 'created_at': true},
        where: { accountOrigin: { id: req.params.id } },
    })
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
    return res.json(tx)
});

export default router;
