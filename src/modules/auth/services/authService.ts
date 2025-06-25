import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword, generateToken } from '@/utils/auth'
import { CreateUserRequest, User } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: Omit<User, 'password'>
  token: string
}

export class AuthService {
  async register(userData: CreateUserRequest): Promise<Omit<User, 'password'>> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hashPassword(userData.password)

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'USER'
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await comparePassword(credentials.password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateUser(userId: string, updateData: Partial<CreateUserRequest>): Promise<Omit<User, 'password'>> {
    const updatePayload: Partial<CreateUserRequest> = { ...updateData }
    
    if (updateData.password) {
      updatePayload.password = await hashPassword(updateData.password)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatePayload
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async deactivateUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    })
  }
} 