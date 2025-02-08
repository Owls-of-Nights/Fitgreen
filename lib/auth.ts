import { compare, hash } from "bcryptjs"
import type { User, SafeUser } from "../models/User"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function excludePassword(user: User): SafeUser {
  const { password, ...safeUser } = user
  return safeUser
}

