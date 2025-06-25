import { prisma } from '@/lib/prisma'
import { CreateStockMovementRequest, StockMovement } from '../types'
import { PrismaClient } from '@prisma/client'

export class StockService {
  async addStockMovement(data: CreateStockMovementRequest, createdBy: string): Promise<StockMovement> {
    // Ürün kontrolü
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    })

    if (!product) {
      throw new Error('Ürün bulunamadı')
    }

    const previousStock = product.stock
    let newStock = previousStock

    // Stok hesaplama
    switch (data.type) {
      case 'IN':
        newStock = previousStock + data.quantity
        break
      case 'OUT':
        if (previousStock < data.quantity) {
          throw new Error('Yetersiz stok')
        }
        newStock = previousStock - data.quantity
        break
      case 'ADJUSTMENT':
        newStock = data.quantity
        break
    }

    // Transaction ile stok güncelleme ve hareket kaydı
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      // Stok güncelleme
      await tx.product.update({
        where: { id: data.productId },
        data: { stock: newStock }
      })

      // Stok hareketi kaydı
      const stockMovement = await tx.stockMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          previousStock,
          newStock,
          reason: data.reason,
          reference: data.reference,
          createdBy
        },
        include: {
          product: true,
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return stockMovement
    })

    return result
  }

  async getStockMovements(productId?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit
    const where = productId ? { productId } : {}

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true
            }
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.stockMovement.count({ where })
    ])

    return {
      movements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getStockMovementById(id: string): Promise<StockMovement> {
    const movement = await prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!movement) {
      throw new Error('Stok hareketi bulunamadı')
    }

    return movement
  }

  async getProductStockHistory(productId: string) {
    return prisma.stockMovement.findMany({
      where: { productId },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getLowStockAlerts() {
    return prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        },
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: { stock: 'asc' }
    })
  }

  async getStockSummary() {
    const [totalProducts, activeProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          stock: { lte: prisma.product.fields.minStock },
          isActive: true
        }
      }),
      prisma.product.count({
        where: {
          stock: 0,
          isActive: true
        }
      })
    ])

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts
    }
  }
} 