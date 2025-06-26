import { PrismaClient } from '@/generated/prisma'
import { BaseRepository } from '../base/baseRepository'
import {
  IOrderRepository,
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderFilters,
  OrderStatus
} from '../interfaces/orderRepository'
import { Order } from '@/types'

export class OrderRepository extends BaseRepository<Order, CreateOrderDTO, UpdateOrderDTO, OrderFilters>
  implements IOrderRepository {

  constructor(prisma: PrismaClient) {
    super(prisma, 'order')
  }

  protected getIncludeRelations() {
    return {
      items: true,
      customer: true,
      createdByUser: true,
      payments: true
    }
  }

  protected buildWhereClause(filters?: OrderFilters) {
    const where: any = {}
    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    if (filters?.customerId) where.customerId = filters.customerId
    if (filters?.status) where.status = filters.status
    if (filters?.dateFrom) where.orderDate = { gte: filters.dateFrom }
    if (filters?.dateTo) where.orderDate = { ...where.orderDate, lte: filters.dateTo }
    if (filters?.createdBy) where.createdBy = filters.createdBy
    return where
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { orderNumber }, include: this.getIncludeRelations() })
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.prisma.order.findMany({ where: { customerId }, include: this.getIncludeRelations() })
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.prisma.order.findMany({ where: { status }, include: this.getIncludeRelations() })
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({ where: { id }, data: { status }, include: this.getIncludeRelations() })
  }

  async getOrderStats() {
    const [total, pending, confirmed, processing, shipped, delivered, cancelled, totalRevenue, avgOrderValue] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.order.count({ where: { status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { status: 'SHIPPED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }).then(res => res._sum.totalAmount || 0),
      this.prisma.order.aggregate({ _avg: { totalAmount: true } }).then(res => res._avg.totalAmount || 0)
    ])
    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
      averageOrderValue: avgOrderValue
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: this.getIncludeRelations()
    })
  }

  async getRecentOrders(limit: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: this.getIncludeRelations()
    })
  }
} 