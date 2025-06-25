import { prisma } from '@/lib/prisma'
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductFilters, 
  ProductListResponse 
} from '../types'

export class ProductService {
  async createProduct(data: CreateProductRequest, createdBy: string) {
    // SKU benzersizlik kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku }
    })

    if (existingProduct) {
      throw new Error('Bu SKU zaten kullanılıyor')
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        createdBy
      },
      include: {
        category: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return product
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!product) {
      throw new Error('Ürün bulunamadı')
    }

    return product
  }

  async updateProduct(id: string, data: UpdateProductRequest) {
    // Ürün varlık kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      throw new Error('Ürün bulunamadı')
    }

    // SKU benzersizlik kontrolü (eğer SKU değiştiriliyorsa)
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: data.sku }
      })

      if (skuExists) {
        throw new Error('Bu SKU zaten kullanılıyor')
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return product
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true
      }
    })

    if (!product) {
      throw new Error('Ürün bulunamadı')
    }

    // Siparişlerde kullanılıyorsa silme
    if (product.orderItems.length > 0) {
      throw new Error('Bu ürün siparişlerde kullanıldığı için silinemez')
    }

    await prisma.product.delete({
      where: { id }
    })

    return { message: 'Ürün başarıyla silindi' }
  }

  async getProducts(filters: ProductFilters): Promise<ProductListResponse> {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      lowStock,
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
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (minPrice !== undefined) {
      where.price = { gte: minPrice }
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice }
    }

    if (inStock !== undefined) {
      where.stock = inStock ? { gt: 0 } : { lte: 0 }
    }

    if (lowStock !== undefined) {
      where.stock = { lte: prisma.product.fields.minStock }
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    // Toplam sayı
    const total = await prisma.product.count({ where })

    // Ürünler
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getLowStockProducts() {
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

  async updateStock(productId: string, newStock: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new Error('Ürün bulunamadı')
    }

    return prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
      include: {
        category: true
      }
    })
  }
} 