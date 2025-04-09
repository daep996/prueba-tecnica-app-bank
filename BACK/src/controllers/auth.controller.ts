import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { AppDataSource } from "../config/data-source";
import { JwtService } from "../utils/jwt";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User)

export const login = async (
  req: Request,
  res: Response
): Promise<Response<Record<string, string>>> => {
  const { email, password } = req.body
  const user = await userRepo.findOneBy({ email: email })

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid)
    return res.status(401).json({ message: "Credenciales inválidas" })

  const token = JwtService.sign({ userId: user.id })
  return res.json({ token })
};
export const register = async (
  req: Request,
  res: Response
): Promise<Response<Record<string, string>>> => {
  const { email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 8)

  const user = userRepo.create({ email, password: hashedPassword })
  await userRepo.save(user)
  return res.json({ message: "Usuario registrado" })
}
