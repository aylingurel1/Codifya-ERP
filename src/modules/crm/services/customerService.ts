import { prisma } from '@/lib/prisma'
import { 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerFilters, 
  CustomerListResponse,
  CustomerStats,
  CustomerHistory
} from '../types'
import { validateEmail, validatePhone, validateTaxNumber } from '@/utils/validation'
import { logger } from '@/utils/logger'

export class CustomerService {
  async createCustomer(data: CreateCustomerRequest, createdBy: string) {
    // Validation
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Geçersiz email formatı')
    }

    if (data.phone && !validatePhone(data.phone)) {
      throw new Error('Geçersiz telefon numarası formatı')
    }

    if (data.taxNumber && !validateTaxNumber(data.taxNumber)) {
      throw new Error('Geçersiz vergi numarası formatı')
    }

    // Email benzersizlik kontrolü
    if (data.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: data.email }
      })
      if (existingCustomer) {
        throw new Error('Bu email adresi zaten kullanılıyor')
      }
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        createdBy
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.info('Müşteri oluşturuldu', { customerId: customer.id, createdBy })
    return customer
  }

  async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            orderDate: true
          },
          orderBy: { orderDate: 'desc' },
          take: 10
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            totalAmount: true,
            dueDate: true
          },
          orderBy: { dueDate: 'desc' },
          take: 10
        }
      }
    })

    if (!customer) {
      throw new Error('Müşteri bulunamadı')
    }

    return customer
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest) {
    // Müşteri varlık kontrolü
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!existingCustomer) {
      throw new Error('Müşteri bulunamadı')
    }

    // Validation
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Geçersiz email formatı')
    }

    if (data.phone && !validatePhone(data.phone)) {
      throw new Error('Geçersiz telefon numarası formatı')
    }

    if (data.taxNumber && !validateTaxNumber(data.taxNumber)) {
      throw new Error('Geçersiz vergi numarası formatı')
    }

    // Email benzersizlik kontrolü (eğer değiştiriliyorsa)
    if (data.email && data.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findFirst({
        where: { email: data.email }
      })
      if (emailExists) {
        throw new Error('Bu email adresi zaten kullanılıyor')
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data,
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.info('Müşteri güncellendi', { customerId: id })
    return customer
  }

  async deleteCustomer(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        invoices: true
      }
    })

    if (!customer) {
      throw new Error('Müşteri bulunamadı')
    }

    // Sipariş veya fatura varsa silme
    if (customer.orders.length > 0 || customer.invoices.length > 0) {
      throw new Error('Bu müşterinin siparişleri veya faturaları olduğu için silinemez')
    }

    await prisma.customer.delete({
      where: { id }
    })

    logger.info('Müşteri silindi', { customerId: id })
    return { message: 'Müşteri başarıyla silindi' }
  }

  async getCustomers(filters: CustomerFilters): Promise<CustomerListResponse> {
    const {
      search,
      company,
      isActive,
      page = 1,
      limit = 10
    } = filters

    const skip = (page - 1) * limit

    // Filtreleme koşulları
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (company) {
      where.company = { contains: company, mode: 'insensitive' }
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    // Toplam sayı
    const total = await prisma.customer.count({ where })

    // Müşteriler
    const customers = await prisma.customer.findMany({
      where,
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            orderDate: true
          },
          orderBy: { orderDate: 'desc' },
          take: 5
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            totalAmount: true,
            dueDate: true
          },
          orderBy: { dueDate: 'desc' },
          take: 5
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return {
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getCustomerStats(): Promise<CustomerStats> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Toplam müşteri sayısı
    const totalCustomers = await prisma.customer.count()

    // Aktif müşteri sayısı
    const activeCustomers = await prisma.customer.count({
      where: { isActive: true }
    })

    // Bu ay yeni müşteri sayısı
    const newCustomersThisMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // En çok sipariş veren müşteriler
    const topCustomers = await prisma.customer.findMany({
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orders: {
          select: {
            totalAmount: true
          }
        }
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      take: 5
    })

    const topCustomersWithStats = topCustomers.map(customer => ({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        createdBy: customer.createdBy,
        createdByUser: customer.createdByUser,
        orders: customer.orders,
        invoices: []
      },
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0)
    }))

    // Müşteri büyüme grafiği (son 6 ay)
    const customerGrowth = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const count = await prisma.customer.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      customerGrowth.push({
        month: monthStart.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        count
      })
    }

    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      topCustomers: topCustomersWithStats,
      customerGrowth
    }
  }

  async getCustomerHistory(customerId: string): Promise<CustomerHistory> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      throw new Error('Müşteri bulunamadı')
    }

    // Sipariş geçmişi
    const orders = await prisma.order.findMany({
      where: { customerId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        orderDate: true
      },
      orderBy: { orderDate: 'desc' }
    })

    // Fatura geçmişi
    const invoices = await prisma.invoice.findMany({
      where: { customerId },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        totalAmount: true,
        dueDate: true
      },
      orderBy: { dueDate: 'desc' }
    })

    // Ödeme geçmişi
    const payments = await prisma.payment.findMany({
      where: {
        order: {
          customerId
        }
      },
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        paymentDate: true
      },
      orderBy: { paymentDate: 'desc' }
    })

    return {
      orders,
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        amount: invoice.totalAmount,
        dueDate: invoice.dueDate
      })),
      payments
    }
  }
} 