import { User } from '@/types'
import { IBaseRepository } from './baseRepository'

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER'

export interface CreateUserDTO {
  email: string
  password: string
  name: string
  role?: UserRole
}

export interface UpdateUserDTO {
  email?: string
  name?: string
  role?: UserRole
  isActive?: boolean
}

export interface UserFilters {
  search?: string
  role?: UserRole
  isActive?: boolean
  email?: string
}

export interface IUserRepository extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO, UserFilters> {
  findByEmail(email: string): Promise<User | null>
  findByRole(role: UserRole): Promise<User[]>
  updatePassword(id: string, hashedPassword: string): Promise<User>
  deactivateUser(id: string): Promise<User>
  activateUser(id: string): Promise<User>
} 