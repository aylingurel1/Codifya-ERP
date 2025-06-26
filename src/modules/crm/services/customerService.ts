import { 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerFilters, 
  CustomerListResponse,
  CustomerStats,
  CustomerHistory,
  Customer
} from '../types'
import { validateEmail, validatePhone, validateTaxNumber } from '@/utils/validation'
import { CustomerRepository } from '@/repositories/implementations/customerRepository'
import { Logger } from '@/utils/logger'
import { prisma } from '@/lib/prisma'

export interface ICustomerService {
  createCustomer(data: CreateCustomerRequest, createdBy: string): Promise<any>
  getCustomerById(id: string): Promise<any>
  updateCustomer(id: string, data: UpdateCustomerRequest): Promise<any>
  deleteCustomer(id: string): Promise<void>
  getCustomers(filters: CustomerFilters): Promise<CustomerListResponse>
  getCustomerStats(): Promise<CustomerStats>
  getCustomerHistory(customerId: string): Promise<CustomerHistory>
}

export class CustomerService implements ICustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private logger: Logger
  ) {}

  // Factory method
  static create(): ICustomerService {
    const customerRepository = new CustomerRepository(prisma)
    const logger = new Logger()
    return new CustomerService(customerRepository, logger)
  }

  // Validation helper
  private validateCustomerData(data: CreateCustomerRequest | UpdateCustomerRequest) {
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Geçersiz email formatı')
    }

    if (data.phone && !validatePhone(data.phone)) {
      throw new Error('Geçersiz telefon numarası formatı')
    }

    if (data.taxNumber && !validateTaxNumber(data.taxNumber)) {
      throw new Error('Geçersiz vergi numarası formatı')
    }
  }

  // Email uniqueness validation
  private async validateEmailUniqueness(email: string, excludeId?: string) {
    const existingCustomer = await this.customerRepository.findByEmail(email)
    if (existingCustomer && existingCustomer.id !== excludeId) {
      throw new Error('Bu email adresi zaten kullanılıyor')
    }
  }

  async createCustomer(data: CreateCustomerRequest, createdBy: string) {
    // Validation
    this.validateCustomerData(data)

    // Email benzersizlik kontrolü
    if (data.email) {
      await this.validateEmailUniqueness(data.email)
    }

    const customer = await this.customerRepository.create({
      ...data,
      createdBy
    })

    this.logger.info('Müşteri oluşturuldu', { customerId: customer.id, createdBy })
    return customer
  }

  async getCustomerById(id: string) {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      throw new Error('Müşteri bulunamadı')
    }

    return customer
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest) {
    // Validation
    this.validateCustomerData(data)

    // Email benzersizlik kontrolü (kendisi hariç)
    if (data.email) {
      await this.validateEmailUniqueness(data.email, id)
    }

    const customer = await this.customerRepository.update(id, data)
    this.logger.info('Müşteri güncellendi', { customerId: id })
    return customer
  }

  async deleteCustomer(id: string) {
    await this.customerRepository.delete(id)
    this.logger.info('Müşteri silindi', { customerId: id })
  }

  async getCustomers(filters: CustomerFilters): Promise<CustomerListResponse> {
    const {
      page = 1,
      limit = 10
    } = filters

    const result = await this.customerRepository.findManyPaginated(filters, page, limit)

    // Tip dönüşümü - CRM types'daki Customer tipine uygun hale getir
    const customers: Customer[] = result.data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      company: customer.company,
      taxNumber: customer.taxNumber,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      createdBy: customer.createdBy,
      createdByUser: customer.createdByUser,
      orders: customer.orders?.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate
      })) || [],
      invoices: customer.invoices?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        amount: invoice.totalAmount, // CRM types'da amount, global'da totalAmount
        dueDate: invoice.dueDate
      })) || []
    }))

    return {
      customers,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  }

  async getCustomerStats(): Promise<CustomerStats> {
    const basicStats = await this.customerRepository.getCustomerStats()
    
    // Eksik alanları hesapla
    const newCustomersThisMonth = await this.getNewCustomersThisMonth()
    const topCustomers = await this.getTopCustomers()
    const customerGrowth = await this.getCustomerGrowth()
    
    return {
      totalCustomers: basicStats.total,
      activeCustomers: basicStats.active,
      newCustomersThisMonth,
      topCustomers,
      customerGrowth
    }
  }

  async getCustomerHistory(customerId: string): Promise<CustomerHistory> {
    const history = await this.customerRepository.getCustomerHistory(customerId)
    return history
  }

  // Helper methods for CustomerStats
  private async getNewCustomersThisMonth(): Promise<number> {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const count = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    return count
  }

  private async getTopCustomers(): Promise<Array<{ customer: Customer; totalOrders: number; totalSpent: number }>> {
    const topCustomers = await prisma.customer.findMany({
      take: 5,
      include: {
        orders: true,
        invoices: true,
        createdByUser: true
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      }
    })

    return topCustomers.map(customer => ({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        company: customer.company,
        taxNumber: customer.taxNumber,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        createdBy: customer.createdBy,
        createdByUser: customer.createdByUser,
        orders: customer.orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate
        })),
        invoices: customer.invoices.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          status: invoice.status,
          amount: invoice.totalAmount, // CRM types'da amount, global'da totalAmount
          dueDate: invoice.dueDate
        }))
      },
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0)
    }))
  }

  private async getCustomerGrowth(): Promise<Array<{ month: string; count: number }>> {
    const months = []
    const now = new Date()
    
    // Son 6 ayın verilerini al
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const count = await prisma.customer.count({
        where: {
          createdAt: {
            gte: month,
            lt: nextMonth
          }
        }
      })

      months.push({
        month: month.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        count
      })
    }

    return months
  }
} 