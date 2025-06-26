import { prisma } from '@/lib/prisma'
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductFilters, 
  ProductListResponse 
} from '../types'
import { Product, User } from '@/types'

// Prisma'dan dönen veriyi User tipine uygun şekilde map'le
function mapUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '', // dummy
    role: 'USER', // dummy
    isActive: true, // dummy
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Prisma'dan dönen veriyi Product tipine uygun şekilde map'le
function mapProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description || undefined, // null -> undefined
    sku: prismaProduct.sku,
    price: prismaProduct.price,
    cost: prismaProduct.cost,
    stock: prismaProduct.stock,
    minStock: prismaProduct.minStock,
    category: prismaProduct.category ? {
      id: prismaProduct.category.id,
      name: prismaProduct.category.name,
      description: prismaProduct.category.description || undefined,
      parentId: prismaProduct.category.parentId || undefined,
      isActive: prismaProduct.category.isActive,
      createdAt: prismaProduct.category.createdAt,
      updatedAt: prismaProduct.category.updatedAt
    } : null,
    isActive: prismaProduct.isActive,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
    createdBy: prismaProduct.createdBy,
    createdByUser: prismaProduct.createdByUser ? mapUser(prismaProduct.createdByUser) : undefined
  }
}

export interface IProductService {
  createProduct(data: CreateProductRequest, createdBy: string): Promise<any>
  getProductById(id: string): Promise<any>
  updateProduct(id: string, data: UpdateProductRequest): Promise<any>
  deleteProduct(id: string): Promise<any>
  getProducts(filters: ProductFilters): Promise<ProductListResponse>
  getLowStockProducts(): Promise<any[]>
  updateStock(productId: string, newStock: number): Promise<any>
}

export class ProductService implements IProductService {
  async createProduct(data: CreateProductRequest, createdBy: string) {
    // SKU benzersizlik kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku }
    })

    if (existingProduct) {
      throw new Error('Bu SKU zaten kullanılıyor')
    }

    // Kategori kontrolü
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      })

      if (!category) {
        throw new Error('Kategori bulunamadı')
      }
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        categoryId: data.categoryId,
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

    return mapProduct(product)
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

    return mapProduct(product)
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

    return mapProduct(product)
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
    const rawProducts = await prisma.product.findMany({
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

    const products = rawProducts.map(mapProduct)

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getLowStockProducts() {
    const products = await prisma.product.findMany({
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

    return products.map(mapProduct)
  }

  async updateStock(productId: string, newStock: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new Error('Ürün bulunamadı')
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
      include: {
        category: true
      }
    })

    return mapProduct(updatedProduct)
  }
} 