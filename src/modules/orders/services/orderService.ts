import { prisma } from '@/lib/prisma'
import { CreateOrderRequest, UpdateOrderRequest, OrderFilters, OrderListResponse, OrderStatus, OrderItem } from '../types'

export class OrderService {
  // Sipariş oluşturma
  async createOrder(data: CreateOrderRequest, createdBy: string) {
    // Müşteri kontrolü
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } })
    if (!customer) throw new Error('Müşteri bulunamadı')

    // Ürün kontrolü ve toplam hesaplama
    let totalAmount = 0
    let taxAmount = 0
    const items: { productId: string; quantity: number; price: number; total: number }[] = []
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) throw new Error('Ürün bulunamadı')
      if (!product.isActive) throw new Error('Ürün aktif değil')
      if (product.stock < item.quantity) throw new Error('Yetersiz stok: ' + product.name)
      const price = product.price
      const total = price * item.quantity
      totalAmount += total
      // Basit vergi: %18
      taxAmount += total * 0.18
      items.push({ productId: product.id, quantity: item.quantity, price, total })
    }
    // İndirim
    const discount = data.discount || 0
    totalAmount = totalAmount - discount
    if (totalAmount < 0) totalAmount = 0

    // Sipariş numarası üret
    const orderNumber = 'ORD-' + Date.now()

    // Transaction ile sipariş ve stok güncelle
    const order = await prisma.$transaction(async (tx) => {
      // Sipariş oluştur
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          status: 'PENDING',
          totalAmount,
          taxAmount,
          discount,
          notes: data.notes,
          orderDate: new Date(),
          createdBy,
          items: {
            create: items.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
              total: i.total
            }))
          }
        },
        include: {
          items: true,
          customer: true,
          createdByUser: true,
          payments: true
        }
      })
      // Stok güncelle
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }
      return createdOrder
    })
    return order
  }

  // Sipariş güncelleme
  async updateOrder(id: string, data: UpdateOrderRequest) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new Error('Sipariş bulunamadı')
    // Sadece not, müşteri, indirim ve durum güncellenebilir
    const updated = await prisma.order.update({
      where: { id },
      data: {
        customerId: data.customerId,
        notes: data.notes,
        discount: data.discount,
        status: data.status
      },
      include: {
        items: true,
        customer: true,
        createdByUser: true,
        payments: true
      }
    })
    return updated
  }

  // Sipariş silme
  async deleteOrder(id: string) {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
    if (!order) throw new Error('Sipariş bulunamadı')
    // Sipariş silinince stok geri eklenir
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      }
      await tx.order.delete({ where: { id } })
    })
    return { message: 'Sipariş silindi' }
  }

  // Sipariş listeleme/filtreleme
  async getOrders(filters: OrderFilters): Promise<OrderListResponse> {
    const {
      search,
      customerId,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = filters
    const skip = (page - 1) * limit
    const where: any = {}
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (customerId) where.customerId = customerId
    if (status) where.status = status
    if (dateFrom) where.orderDate = { gte: new Date(dateFrom) }
    if (dateTo) where.orderDate = { ...where.orderDate, lte: new Date(dateTo) }
    const total = await prisma.order.count({ where })
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: true,
        createdByUser: true,
        payments: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Sipariş detayı
  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
        createdByUser: true,
        payments: true
      }
    })
    if (!order) throw new Error('Sipariş bulunamadı')
    return order
  }

  // Sipariş durumunu güncelle
  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new Error('Sipariş bulunamadı')
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        customer: true,
        createdByUser: true,
        payments: true
      }
    })
    return updated
  }

  // Siparişe ürün ekle (ekstra endpoint için)
  async addOrderItem(orderId: string, productId: string, quantity: number) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    if (!order) throw new Error('Sipariş bulunamadı')
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new Error('Ürün bulunamadı')
    if (product.stock < quantity) throw new Error('Yetersiz stok')
    const price = product.price
    const total = price * quantity
    // Siparişe ürün ekle
    const item = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
        total
      }
    })
    // Stok güncelle
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } }
    })
    // Sipariş toplamını güncelle
    await this.recalculateOrderTotals(orderId)
    return item
  }

  // Siparişten ürün çıkar (ekstra endpoint için)
  async removeOrderItem(orderItemId: string) {
    const item = await prisma.orderItem.findUnique({ where: { id: orderItemId } })
    if (!item) throw new Error('Sipariş ürünü bulunamadı')
    // Stok geri ekle
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    })
    // Ürünü sil
    await prisma.orderItem.delete({ where: { id: orderItemId } })
    // Sipariş toplamını güncelle
    await this.recalculateOrderTotals(item.orderId)
    return { message: 'Sipariş ürünü silindi' }
  }

  // Sipariş toplamını yeniden hesapla
  async recalculateOrderTotals(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    if (!order) return
    let totalAmount = 0
    let taxAmount = 0
    for (const item of order.items) {
      totalAmount += item.total
      taxAmount += item.total * 0.18
    }
    totalAmount = totalAmount - (order.discount || 0)
    if (totalAmount < 0) totalAmount = 0
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount,
        taxAmount
      }
    })
  }
} 