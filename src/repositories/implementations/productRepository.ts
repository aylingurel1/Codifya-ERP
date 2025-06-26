import { PrismaClient } from '@/generated/prisma'
import { BaseRepository } from '../base/baseRepository'
import {
  IProductRepository,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters
} from '../interfaces/productRepository'
import { Product } from '@/types'

export class ProductRepository extends BaseRepository<Product, CreateProductDTO, UpdateProductDTO, ProductFilters>
  implements IProductRepository {

  constructor(prisma: PrismaClient) {
    super(prisma, 'product')
  }

  protected getIncludeRelations() {
    return {
      category: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  }

  protected buildWhereClause(filters?: ProductFilters) {
    const where: any = {}
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }
    if (filters?.minPrice !== undefined) {
      where.price = { gte: filters.minPrice }
    }
    if (filters?.maxPrice !== undefined) {
      where.price = { ...where.price, lte: filters.maxPrice }
    }
    if (filters?.inStock !== undefined) {
      where.stock = filters.inStock ? { gt: 0 } : { lte: 0 }
    }
    if (filters?.lowStock !== undefined) {
      where.stock = { lte: 5 }
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    if (filters?.createdBy) {
      where.createdBy = filters.createdBy
    }
    return where
  }

  async findBySKU(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { sku }, include: this.getIncludeRelations() })
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { categoryId }, include: this.getIncludeRelations() })
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { stock: { lte: 5 } }, include: this.getIncludeRelations() })
  }

  async updateStock(productId: string, newStock: number): Promise<Product> {
    return this.prisma.product.update({ where: { id: productId }, data: { stock: newStock }, include: this.getIncludeRelations() })
  }

  async getProductStats() {
    const [total, active, inactive, lowStock, outOfStock, totalValue] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: false } }),
      this.prisma.product.count({ where: { stock: { lte: 5 } } }),
      this.prisma.product.count({ where: { stock: { lte: 0 } } }),
      this.prisma.product.aggregate({ _sum: { price: true } }).then(res => res._sum.price || 0)
    ])
    return { total, active, inactive, lowStock, outOfStock, totalValue }
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: this.getIncludeRelations()
    })
  }
} 