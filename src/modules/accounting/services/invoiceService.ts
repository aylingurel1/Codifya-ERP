import { prisma } from '@/lib/prisma'
import { CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceFilters, InvoiceListResponse, InvoiceStatus, InvoiceType } from '../types/invoice'

export class InvoiceService {
  // Fatura oluşturma
  async createInvoice(data: CreateInvoiceRequest, createdBy: string) {
    // Fatura numarası üret
    const invoiceNumber = 'INV-' + Date.now()

    // Toplam tutarı hesapla
    const taxAmount = data.taxAmount || 0
    const discount = data.discount || 0
    const totalAmount = data.subtotal + taxAmount - discount

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: data.orderId,
        customerId: data.customerId,
        type: data.type,
        status: 'DRAFT',
        subtotal: data.subtotal,
        taxAmount,
        discount,
        totalAmount,
        dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        notes: data.notes,
        createdBy
      },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        },
        customer: true,
        createdByUser: true
      }
    })

    return invoice
  }

  // Siparişten fatura oluşturma
  async createInvoiceFromOrder(orderId: string, createdBy: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: true
      }
    })

    if (!order) throw new Error('Sipariş bulunamadı')

    // Mevcut fatura kontrolü
    const existingInvoice = await prisma.invoice.findFirst({
      where: { orderId }
    })

    if (existingInvoice) throw new Error('Bu sipariş için zaten fatura oluşturulmuş')

    const invoiceData: CreateInvoiceRequest = {
      orderId: order.id,
      customerId: order.customerId,
      type: 'SALES',
      subtotal: order.totalAmount + order.discount, // İndirim öncesi tutar
      taxAmount: order.taxAmount,
      discount: order.discount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
      notes: `Sipariş ${order.orderNumber} için fatura`
    }

    return this.createInvoice(invoiceData, createdBy)
  }

  // Fatura güncelleme
  async updateInvoice(id: string, data: UpdateInvoiceRequest) {
    const invoice = await prisma.invoice.findUnique({ where: { id } })
    if (!invoice) throw new Error('Fatura bulunamadı')

    // Toplam tutarı yeniden hesapla
    let totalAmount = invoice.totalAmount
    if (data.subtotal !== undefined || data.taxAmount !== undefined || data.discount !== undefined) {
      const subtotal = data.subtotal ?? invoice.subtotal
      const taxAmount = data.taxAmount ?? invoice.taxAmount
      const discount = data.discount ?? invoice.discount
      totalAmount = subtotal + taxAmount - discount
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: data.status,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        discount: data.discount,
        totalAmount,
        dueDate: data.dueDate,
        notes: data.notes,
        paidDate: data.status === 'PAID' ? new Date() : invoice.paidDate
      },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        },
        customer: true,
        createdByUser: true
      }
    })

    return updated
  }

  // Fatura silme
  async deleteInvoice(id: string) {
    const invoice = await prisma.invoice.findUnique({ where: { id } })
    if (!invoice) throw new Error('Fatura bulunamadı')
    
    if (invoice.status === 'PAID') {
      throw new Error('Ödenmiş fatura silinemez')
    }

    await prisma.invoice.delete({ where: { id } })
    return { message: 'Fatura silindi' }
  }

  // Fatura listeleme/filtreleme
  async getInvoices(filters: InvoiceFilters): Promise<InvoiceListResponse> {
    const {
      customerId,
      status,
      type,
      dateFrom,
      dateTo,
      dueDateFrom,
      dueDateTo,
      page = 1,
      limit = 10
    } = filters
    
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (customerId) where.customerId = customerId
    if (status) where.status = status
    if (type) where.type = type
    if (dateFrom || dateTo) {
      where.issueDate = {}
      if (dateFrom) where.issueDate.gte = new Date(dateFrom)
      if (dateTo) where.issueDate.lte = new Date(dateTo)
    }
    if (dueDateFrom || dueDateTo) {
      where.dueDate = {}
      if (dueDateFrom) where.dueDate.gte = new Date(dueDateFrom)
      if (dueDateTo) where.dueDate.lte = new Date(dueDateTo)
    }

    const total = await prisma.invoice.count({ where })
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        },
        customer: true,
        createdByUser: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return {
      invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Fatura detayı
  async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        },
        customer: true,
        createdByUser: true
      }
    })
    if (!invoice) throw new Error('Fatura bulunamadı')
    return invoice
  }

  // Fatura durumunu güncelle
  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    const invoice = await prisma.invoice.findUnique({ where: { id } })
    if (!invoice) throw new Error('Fatura bulunamadı')

    const updated = await prisma.invoice.update({
      where: { id },
      data: { 
        status,
        paidDate: status === 'PAID' ? new Date() : invoice.paidDate
      },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        },
        customer: true,
        createdByUser: true
      }
    })

    return updated
  }

  // Fatura özeti
  async getInvoiceSummary() {
    const totalInvoices = await prisma.invoice.count()
    const paidInvoices = await prisma.invoice.count({ where: { status: 'PAID' } })
    const pendingInvoices = await prisma.invoice.count({ where: { status: 'SENT' } })
    const draftInvoices = await prisma.invoice.count({ where: { status: 'DRAFT' } })

    const totalAmount = await prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true }
    })

    const pendingAmount = await prisma.invoice.aggregate({
      where: { status: 'SENT' },
      _sum: { totalAmount: true }
    })

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      draftInvoices,
      totalPaidAmount: totalAmount._sum.totalAmount || 0,
      totalPendingAmount: pendingAmount._sum.totalAmount || 0
    }
  }
} 