import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Account } from '../entities/Account';

const txRepo = AppDataSource.getRepository(Transaction);
const accountRepo = AppDataSource.getRepository(Account);

export const accountsDetails = async (req: Request, res: Response): Promise<Response<Transaction[]>> => {
    const tx = await txRepo.find({
        select: {id: true, amount: true, concept: true, 'type': true, 'created_at': true},
        where: { accountOrigin: { id: req.params.id } },
    })
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
        return res.json(tx)
}

export const accountsDetailsByUser = async (req: Request, res: Response): Promise<Response<Transaction[]>> => {
    const tx = await txRepo.find({
        select: {id: true, amount: true, concept: true, 'type': true, 'created_at': true},
        where: { user: { id: req.params.id } },
    })
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
        return res.json(tx)
}

export const accountsDetail = async (req: Request, res: Response): Promise<Response<Transaction>> => {
    const tx = await txRepo.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['accountOrigin', 'accountDestination'],
    })
    if (!tx) return res.status(404).json({ message: 'Transacción no encontrada' })
        return res.json(tx)
}

export const createTransaction = async (req: Request, res: Response): Promise<Response<Record<string, string>>> => {
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
}
