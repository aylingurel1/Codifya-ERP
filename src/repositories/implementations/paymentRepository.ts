import { PrismaClient } from '@/generated/prisma'
import { BaseRepository } from '../base/baseRepository'
import {
  IPaymentRepository,
  CreatePaymentDTO,
  UpdatePaymentDTO,
  PaymentFilters,
  PaymentMethod,
  PaymentStatus
} from '../interfaces/paymentRepository'
import { Payment } from '@/types'

export class PaymentRepository extends BaseRepository<Payment, CreatePaymentDTO, UpdatePaymentDTO, PaymentFilters>
  implements IPaymentRepository {

  constructor(prisma: PrismaClient) {
    super(prisma, 'payment')
  }

  protected getIncludeRelations() {
    return {
      order: true
    }
  }

  protected buildWhereClause(filters?: PaymentFilters) {
    const where: any = {}
    if (filters?.orderId) where.orderId = filters.orderId
    if (filters?.method) where.method = filters.method
    if (filters?.status) where.status = filters.status
    if (filters?.dateFrom) where.paymentDate = { gte: filters.dateFrom }
    if (filters?.dateTo) where.paymentDate = { ...where.paymentDate, lte: filters.dateTo }
    if (filters?.minAmount !== undefined) where.amount = { ...where.amount, gte: filters.minAmount }
    if (filters?.maxAmount !== undefined) where.amount = { ...where.amount, lte: filters.maxAmount }
    return where
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({ where: { orderId }, include: this.getIncludeRelations() })
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.prisma.payment.findMany({ where: { status }, include: this.getIncludeRelations() })
  }

  async findByMethod(method: PaymentMethod): Promise<Payment[]> {
    return this.prisma.payment.findMany({ where: { method }, include: this.getIncludeRelations() })
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return this.prisma.payment.update({ where: { id }, data: { status }, include: this.getIncludeRelations() })
  }

  async getPaymentStats() {
    const [total, pending, completed, failed, refunded, totalAmount, avgAmount] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.payment.count({ where: { status: 'FAILED' } }),
      this.prisma.payment.count({ where: { status: 'REFUNDED' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }).then(res => res._sum.amount || 0),
      this.prisma.payment.aggregate({ _avg: { amount: true } }).then(res => res._avg.amount || 0)
    ])
    return {
      total,
      pending,
      completed,
      failed,
      refunded,
      totalAmount,
      averageAmount: avgAmount
    }
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: this.getIncludeRelations()
    })
  }
} 