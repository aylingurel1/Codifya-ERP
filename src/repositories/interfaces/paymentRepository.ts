import { Payment } from '@/types'
import { IBaseRepository } from './baseRepository'

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface CreatePaymentDTO {
  orderId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  reference?: string
  paymentDate: Date
}

export interface UpdatePaymentDTO {
  amount?: number
  method?: PaymentMethod
  status?: PaymentStatus
  reference?: string
  paymentDate?: Date
}

export interface PaymentFilters {
  orderId?: string
  method?: PaymentMethod
  status?: PaymentStatus
  dateFrom?: Date
  dateTo?: Date
  minAmount?: number
  maxAmount?: number
}

export interface IPaymentRepository extends IBaseRepository<Payment, CreatePaymentDTO, UpdatePaymentDTO, PaymentFilters> {
  findByOrder(orderId: string): Promise<Payment[]>
  findByStatus(status: PaymentStatus): Promise<Payment[]>
  findByMethod(method: PaymentMethod): Promise<Payment[]>
  updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment>
  getPaymentStats(): Promise<{
    total: number
    pending: number
    completed: number
    failed: number
    refunded: number
    totalAmount: number
    averageAmount: number
  }>
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>
} 