import { Request, Response, NextFunction } from 'express'
import { JwtService } from '../utils/jwt'

export function authMiddleware(req: Request, res: Response, next: NextFunction) : void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token missing or invalid' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = JwtService.verify(token);
        (req as any).user = payload
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
        return
    }
}