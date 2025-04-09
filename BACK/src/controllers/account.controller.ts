import { Request, Response } from 'express';

import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { User } from '../entities/User';

const accountRepo = AppDataSource.getRepository(Account)
const userRepo = AppDataSource.getRepository(User)

export const accountDetails = async (req: Request, res: Response): Promise<Response<Account>> => {
    const account = await accountRepo.findOne({
        where: { id: req.params.id, user: { id: req.body.userId } },
    })
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' })
    return res.json(account)
}

export const accountsByUser = async (req: Request, res: Response): Promise<Response<Account[]>> => {
    const id = req.params.id ??  ''
    const user = await userRepo.findOneBy({ id })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        
        const userAccounts = await accountRepo.find({
            where: {
                user: { id },
            },
            order: {
                accountNumber: 'ASC',
                id: 'ASC'
            }
        })
        return res.json(userAccounts)
    }
    
export const createAccount = async (req: Request, res: Response): Promise<Response<Account>> => {
    const { type, balance } = req.body as { type: string; balance: number }
    const user = await userRepo.findOneBy({ id: req.body.userId })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const account = accountRepo.create({
        accountNumber: Math.random().toString().slice(2, 12),
        type,
        user,
        balance: isNaN(balance) ? 0 : balance,
    })

    await accountRepo.save(account)
    return res.json(account)
}
    