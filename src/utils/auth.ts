import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    if (!JWT_SECRET) {
      return null
    }
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export const extractTokenFromHeader = (authorization: string | undefined): string | null => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }
  return authorization.substring(7)
} 