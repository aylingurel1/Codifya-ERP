import { PrismaClient } from '@/generated/prisma'
import { BaseRepository } from '../base/baseRepository'
import {
  IOrderRepository,
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderFilters,
  OrderStatus
} from '../interfaces/orderRepository'
import { Order, User, Customer, Product, OrderItem } from '@/types'

// Prisma'dan dönen veriyi User tipine uygun şekilde map'le
function mapUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: "",
    role: "USER",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Prisma'dan dönen veriyi Customer tipine uygun şekilde map'le
function mapCustomer(prismaCustomer: any): Customer {
  return {
    id: prismaCustomer.id,
    name: prismaCustomer.name,
    email: prismaCustomer.email,
    phone: prismaCustomer.phone,
    address: prismaCustomer.address,
    company: prismaCustomer.company,
    taxNumber: prismaCustomer.taxNumber,
    isActive: prismaCustomer.isActive,
    createdAt: prismaCustomer.createdAt,
    updatedAt: prismaCustomer.updatedAt,
    createdBy: prismaCustomer.createdBy,
    createdByUser: prismaCustomer.createdByUser
      ? mapUser(prismaCustomer.createdByUser)
      : undefined,
    orders: [],
    invoices: [],
  };
}

// Prisma'dan dönen veriyi Product tipine uygun şekilde map'le
function mapProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description || undefined,
    sku: prismaProduct.sku,
    price: prismaProduct.price,
    cost: prismaProduct.cost,
    stock: prismaProduct.stock,
    minStock: prismaProduct.minStock,
    category: prismaProduct.category || null,
    isActive: prismaProduct.isActive,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
    createdBy: prismaProduct.createdBy,
    createdByUser: prismaProduct.createdByUser
      ? mapUser(prismaProduct.createdByUser)
      : undefined,
  };
}

// Prisma'dan dönen veriyi OrderItem tipine uygun şekilde map'le
function mapOrderItem(prismaOrderItem: any): OrderItem {
  return {
    id: prismaOrderItem.id,
    orderId: prismaOrderItem.orderId,
    productId: prismaOrderItem.productId,
    product: prismaOrderItem.product ? mapProduct(prismaOrderItem.product) : {
      id: prismaOrderItem.productId,
      name: "Ürün bulunamadı",
      description: null,
      sku: "",
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      category: null,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "",
    },
    quantity: prismaOrderItem.quantity,
    price: prismaOrderItem.price,
    total: prismaOrderItem.total,
  };
}

// Prisma'dan dönen veriyi Order tipine uygun şekilde map'le
function mapOrder(prismaOrder: any): Order {
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    customerId: prismaOrder.customerId,
    customer: prismaOrder.customer
      ? mapCustomer(prismaOrder.customer)
      : undefined,
    status: prismaOrder.status,
    totalAmount: prismaOrder.totalAmount,
    taxAmount: prismaOrder.taxAmount,
    discount: prismaOrder.discount,
    notes: prismaOrder.notes,
    orderDate: prismaOrder.orderDate,
    createdAt: prismaOrder.createdAt,
    updatedAt: prismaOrder.updatedAt,
    createdBy: prismaOrder.createdBy,
    createdByUser: prismaOrder.createdByUser
      ? mapUser(prismaOrder.createdByUser)
      : undefined,
    items: prismaOrder.items ? prismaOrder.items.map(mapOrderItem) : [],
    payments: prismaOrder.payments || [],
    invoices: prismaOrder.invoices || [],
  };
}

export class OrderRepository extends BaseRepository<Order, CreateOrderDTO, UpdateOrderDTO, OrderFilters>
  implements IOrderRepository {

  constructor(prisma: PrismaClient) {
    super(prisma, 'order')
  }

  // BaseRepository metodlarını override ederek mapping kullan
  async create(data: CreateOrderDTO): Promise<Order> {
    try {
      const result = await this.prisma.order.create({
        data,
        include: this.getIncludeRelations()
      })
      return mapOrder(result)
    } catch (error) {
      throw new Error(`Error creating order: ${error}`)
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.prisma.order.findUnique({
        where: { id },
        include: this.getIncludeRelations()
      })
      return result ? mapOrder(result) : null
    } catch (error) {
      throw new Error(`Error finding order by id: ${error}`)
    }
  }

  async update(id: string, data: UpdateOrderDTO): Promise<Order> {
    try {
      const result = await this.prisma.order.update({
        where: { id },
        data,
        include: this.getIncludeRelations()
      })
      return mapOrder(result)
    } catch (error) {
      throw new Error(`Error updating order: ${error}`)
    }
  }

  async findMany(filters?: OrderFilters): Promise<Order[]> {
    try {
      const where = this.buildWhereClause(filters)
      const results = await this.prisma.order.findMany({
        where,
        include: this.getIncludeRelations(),
        orderBy: { createdAt: 'desc' }
      })
      return results.map(mapOrder)
    } catch (error) {
      throw new Error(`Error finding order list: ${error}`)
    }
  }

  async findOne(filters: OrderFilters): Promise<Order | null> {
    try {
      const where = this.buildWhereClause(filters)
      const result = await this.prisma.order.findFirst({
        where,
        include: this.getIncludeRelations()
      })
      return result ? mapOrder(result) : null
    } catch (error) {
      throw new Error(`Error finding order: ${error}`)
    }
  }

  async findManyPaginated(
    filters?: OrderFilters, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: Order[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const where = this.buildWhereClause(filters)
      const skip = (page - 1) * limit

      const [rawData, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: this.getIncludeRelations(),
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.order.count({ where })
      ])

      const data = rawData.map(mapOrder)

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      throw new Error(`Error finding order paginated: ${error}`)
    }
  }

  protected getIncludeRelations() {
    return {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      customer: {
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
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
    const result = await this.prisma.order.findUnique({ 
      where: { orderNumber }, 
      include: this.getIncludeRelations() 
    })
    return result ? mapOrder(result) : null
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    const results = await this.prisma.order.findMany({ 
      where: { customerId }, 
      include: this.getIncludeRelations() 
    })
    return results.map(mapOrder)
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const results = await this.prisma.order.findMany({ 
      where: { status }, 
      include: this.getIncludeRelations() 
    })
    return results.map(mapOrder)
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const result = await this.prisma.order.update({ 
      where: { id }, 
      data: { status }, 
      include: this.getIncludeRelations() 
    })
    return mapOrder(result)
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
    const results = await this.prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: this.getIncludeRelations()
    })
    return results.map(mapOrder)
  }

  async getRecentOrders(limit: number): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: this.getIncludeRelations()
    })
    return results.map(mapOrder)
  }
} 