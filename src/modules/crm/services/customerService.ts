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
import { RepositoryFactory } from '@/repositories'
import { prisma } from '@/lib/prisma'

export class CustomerService {
  private customerRepository: any

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance(prisma)
    this.customerRepository = repositoryFactory.getCustomerRepository()
  }

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
      const existingCustomer = await this.customerRepository.findByEmail(data.email)
      if (existingCustomer) {
        throw new Error('Bu email adresi zaten kullanılıyor')
      }
    }

    const customer = await this.customerRepository.create({
      ...data,
      createdBy
    })

    logger.info('Müşteri oluşturuldu', { customerId: customer.id, createdBy })
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
    // Müşteri varlık kontrolü
    const existingCustomer = await this.customerRepository.findById(id)

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
      const emailExists = await this.customerRepository.findByEmail(data.email)
      if (emailExists) {
        throw new Error('Bu email adresi zaten kullanılıyor')
      }
    }

    const customer = await this.customerRepository.update(id, data)

    logger.info('Müşteri güncellendi', { customerId: id })
    return customer
  }

  async deleteCustomer(id: string) {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      throw new Error('Müşteri bulunamadı')
    }

    // Sipariş veya fatura varsa silme kontrolü
    const customerWithRelations = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        invoices: true
      }
    })

    if (customerWithRelations && (customerWithRelations.orders.length > 0 || customerWithRelations.invoices.length > 0)) {
      throw new Error('Bu müşterinin siparişleri veya faturaları olduğu için silinemez')
    }

    await this.customerRepository.delete(id)

    logger.info('Müşteri silindi', { customerId: id })
    return { message: 'Müşteri başarıyla silindi' }
  }

  async getCustomers(filters: CustomerFilters): Promise<CustomerListResponse> {
    const {
      page = 1,
      limit = 10
    } = filters

    const result = await this.customerRepository.findManyPaginated(filters, page, limit)

    return {
      customers: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  }

  async getCustomerStats(): Promise<CustomerStats> {
    const stats = await this.customerRepository.getCustomerStats()
    return stats
  }

  async getCustomerHistory(customerId: string): Promise<CustomerHistory> {
    const history = await this.customerRepository.getCustomerHistory(customerId)
    return history
  }
} 