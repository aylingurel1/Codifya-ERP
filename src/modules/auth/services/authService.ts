import { hashPassword, comparePassword, generateToken } from '@/utils/auth'
import { CreateUserRequest, User } from '@/types'
import { RepositoryFactory } from '@/repositories'
import { prisma } from '@/lib/prisma'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: Omit<User, 'password'>
  token: string
}

export class AuthService {
  private userRepository: any

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance(prisma)
    this.userRepository = repositoryFactory.getUserRepository()
  }

  async register(userData: CreateUserRequest): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(userData.email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hashPassword(userData.password)

    const user = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'USER'
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(credentials.email)

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

    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return null
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateUser(userId: string, updateData: Partial<CreateUserRequest>): Promise<Omit<User, 'password'>> {
    const updatePayload: any = { ...updateData }
    
    if (updateData.password) {
      updatePayload.password = await hashPassword(updateData.password)
    }

    const user = await this.userRepository.update(userId, updatePayload)

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.deactivateUser(userId)
  }
} 