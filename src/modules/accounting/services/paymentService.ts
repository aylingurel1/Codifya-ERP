import { prisma } from '@/lib/prisma'
import { CreatePaymentRequest, UpdatePaymentRequest, PaymentFilters, PaymentListResponse, PaymentMethod, PaymentStatus } from '../types/payment'

export class PaymentService {
  // Ödeme oluşturma
  async createPayment(data: CreatePaymentRequest) {
    // Sipariş kontrolü
    const order = await prisma.order.findUnique({ 
      where: { id: data.orderId },
      include: { payments: true }
    })
    if (!order) throw new Error('Sipariş bulunamadı')

    // Toplam ödeme kontrolü
    const totalPaid = order.payments.reduce((sum, payment) => {
      return payment.status === 'COMPLETED' ? sum + payment.amount : sum
    }, 0)
    
    const remainingAmount = order.totalAmount - totalPaid
    if (data.amount > remainingAmount) {
      throw new Error(`Ödeme tutarı kalan tutardan fazla olamaz. Kalan: ${remainingAmount}`)
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: 'PENDING',
        reference: data.reference,
        paymentDate: new Date()
      },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        }
      }
    })

    return payment
  }

  // Ödeme güncelleme
  async updatePayment(id: string, data: UpdatePaymentRequest) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new Error('Ödeme bulunamadı')

    // Eğer ödeme tamamlandıysa ve tutar değiştirilmeye çalışılıyorsa kontrol et
    if (payment.status === 'COMPLETED' && data.amount && data.amount !== payment.amount) {
      const order = await prisma.order.findUnique({ 
        where: { id: payment.orderId },
        include: { payments: true }
      })
      
      if (order) {
        const totalPaid = order.payments.reduce((sum, p) => {
          return p.status === 'COMPLETED' && p.id !== id ? sum + p.amount : sum
        }, 0)
        
        const remainingAmount = order.totalAmount - totalPaid
        if (data.amount > remainingAmount) {
          throw new Error(`Ödeme tutarı kalan tutardan fazla olamaz. Kalan: ${remainingAmount}`)
        }
      }
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount,
        method: data.method,
        status: data.status,
        reference: data.reference
      },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        }
      }
    })

    return updated
  }

  // Ödeme silme
  async deletePayment(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new Error('Ödeme bulunamadı')
    
    if (payment.status === 'COMPLETED') {
      throw new Error('Tamamlanmış ödeme silinemez')
    }

    await prisma.payment.delete({ where: { id } })
    return { message: 'Ödeme silindi' }
  }

  // Ödeme listeleme/filtreleme
  async getPayments(filters: PaymentFilters): Promise<PaymentListResponse> {
    const {
      orderId,
      status,
      method,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = filters
    
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (orderId) where.orderId = orderId
    if (status) where.status = status
    if (method) where.method = method
    if (dateFrom || dateTo) {
      where.paymentDate = {}
      if (dateFrom) where.paymentDate.gte = new Date(dateFrom)
      if (dateTo) where.paymentDate.lte = new Date(dateTo)
    }

    const total = await prisma.payment.count({ where })
    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Ödeme detayı
  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        }
      }
    })
    if (!payment) throw new Error('Ödeme bulunamadı')
    return payment
  }

  // Siparişe ait ödemeleri getir
  async getPaymentsByOrder(orderId: string) {
    const payments = await prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    })
    return payments
  }

  // Ödeme durumunu güncelle
  async updatePaymentStatus(id: string, status: PaymentStatus) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new Error('Ödeme bulunamadı')

    const updated = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        order: {
          include: {
            customer: true,
            items: true
          }
        }
      }
    })

    return updated
  }

  // Sipariş ödeme özeti
  async getOrderPaymentSummary(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true }
    })
    
    if (!order) throw new Error('Sipariş bulunamadı')

    const totalPaid = order.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const pendingPayments = order.payments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      orderTotal: order.totalAmount,
      totalPaid,
      pendingAmount: pendingPayments,
      remainingAmount: order.totalAmount - totalPaid,
      isFullyPaid: totalPaid >= order.totalAmount,
      payments: order.payments
    }
  }
} 