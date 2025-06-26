import { PrismaClient } from '@/generated/prisma'
import { BaseRepository } from '../base/baseRepository'
import {
  IInvoiceRepository,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
  InvoiceFilters,
  InvoiceType,
  InvoiceStatus,
  Invoice
} from '../interfaces/invoiceRepository'

export class InvoiceRepository extends BaseRepository<Invoice, CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceFilters>
  implements IInvoiceRepository {

  constructor(prisma: PrismaClient) {
    super(prisma, 'invoice')
  }

  protected getIncludeRelations() {
    return {
      order: {
        include: {
          customer: true,
          items: true
        }
      },
      customer: true,
      createdByUser: true
    }
  }

  protected buildWhereClause(filters?: InvoiceFilters) {
    const where: any = {}
    if (filters?.customerId) where.customerId = filters.customerId
    if (filters?.status) where.status = filters.status
    if (filters?.type) where.type = filters.type
    if (filters?.dateFrom || filters?.dateTo) {
      where.issueDate = {}
      if (filters.dateFrom) where.issueDate.gte = filters.dateFrom
      if (filters.dateTo) where.issueDate.lte = filters.dateTo
    }
    if (filters?.dueDateFrom || filters?.dueDateTo) {
      where.dueDate = {}
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo
    }
    if (filters?.createdBy) where.createdBy = filters.createdBy
    return where
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({ where: { invoiceNumber }, include: this.getIncludeRelations() })
  }

  async findByOrder(orderId: string): Promise<Invoice | null> {
    return this.prisma.invoice.findFirst({ where: { orderId }, include: this.getIncludeRelations() })
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({ where: { customerId }, include: this.getIncludeRelations() })
  }

  async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({ where: { status }, include: this.getIncludeRelations() })
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    return this.prisma.invoice.update({ where: { id }, data: { status }, include: this.getIncludeRelations() })
  }

  async getInvoiceStats() {
    const [total, draft, sent, paid, cancelled, totalAmount, paidAmount, overdueAmount] = await Promise.all([
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: 'DRAFT' } }),
      this.prisma.invoice.count({ where: { status: 'SENT' } }),
      this.prisma.invoice.count({ where: { status: 'PAID' } }),
      this.prisma.invoice.count({ where: { status: 'CANCELLED' } }),
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true } }).then(res => res._sum.totalAmount || 0),
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: 'PAID' } }).then(res => res._sum.totalAmount || 0),
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: 'SENT' } }).then(res => res._sum.totalAmount || 0)
    ])
    return {
      total,
      draft,
      sent,
      paid,
      cancelled,
      totalAmount,
      paidAmount,
      overdueAmount
    }
  }

  async getOverdueInvoices() {
    const now = new Date()
    return this.prisma.invoice.findMany({
      where: {
        status: 'SENT',
        dueDate: { lt: now }
      },
      include: this.getIncludeRelations()
    })
  }

  async getInvoicesByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.invoice.findMany({
      where: {
        issueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: this.getIncludeRelations()
    })
  }
} 