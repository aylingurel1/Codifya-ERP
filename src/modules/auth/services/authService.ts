import { hashPassword, comparePassword, generateToken } from '@/utils/auth'
import { CreateUserRequest, User } from '@/types'
import { UserRepository } from '@/repositories/implementations/userRepository'
import { Logger } from '@/utils/logger'
import { prisma } from '@/lib/prisma'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: Omit<User, 'password'>
  token: string
}

export interface IAuthService {
  register(userData: CreateUserRequest): Promise<Omit<User, 'password'>>
  login(credentials: LoginRequest): Promise<LoginResponse>
  validateToken(token: string): Promise<User | null>
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>
  deactivateUser(userId: string): Promise<void>
}

export class AuthService implements IAuthService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  // Factory method
  static create(): IAuthService {
    const userRepository = new UserRepository(prisma)
    const logger = new Logger()
    return new AuthService(userRepository, logger)
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

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await comparePassword(credentials.password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated')
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

  async validateToken(token: string): Promise<User | null> {
    try {
      // Token validation logic here
      // This would typically decode and verify the JWT token
      return null
    } catch (error) {
      return null
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await comparePassword(oldPassword, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid old password')
    }

    const hashedNewPassword = await hashPassword(newPassword)
    await this.userRepository.updatePassword(userId, hashedNewPassword)
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.deactivateUser(userId)
  }
} 