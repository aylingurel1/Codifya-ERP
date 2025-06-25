import { NextRequest } from 'next/server'
import { OrderService } from '@/modules/orders/services/orderService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const orderService = new OrderService()

// GET - Sipariş dashboard özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    
    const where: any = {}
    if (dateFrom || dateTo) {
      where.orderDate = {}
      if (dateFrom) where.orderDate.gte = new Date(dateFrom)
      if (dateTo) where.orderDate.lte = new Date(dateTo)
    }

    // Toplam sipariş sayısı
    const totalOrders = await prisma.order.count({ where })
    
    // Toplam satış tutarı
    const totalSales = await prisma.order.aggregate({
      where: { ...where, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true }
    })
    
    // Durum bazında sipariş sayıları
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    })
    
    // Son 7 günlük siparişler
    const lastWeekOrders = await prisma.order.findMany({
      where: {
        ...where,
        orderDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { orderDate: 'desc' },
      take: 10,
      include: {
        customer: true,
        items: true
      }
    })
    
    // En çok satan ürünler
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          ...where,
          status: { not: 'CANCELLED' }
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
    
    // En çok sipariş veren müşteriler
    const topCustomers = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        ...where,
        status: { not: 'CANCELLED' }
      },
      _count: { customerId: true },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 5
    })

    const dashboard = {
      totalOrders,
      totalSales: totalSales._sum.totalAmount || 0,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>),
      lastWeekOrders,
      topProducts,
      topCustomers
    }

    return successResponse(dashboard, 'Dashboard verileri getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 