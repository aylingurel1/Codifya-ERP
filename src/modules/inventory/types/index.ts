import { Product } from '@/types'

// Ürün kategorisi
export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  parent?: Category
  children?: Category[]
  products?: Product[]
  _count?: {
    products: number
  }
}

// Ürün oluşturma isteği
export interface CreateProductRequest {
  name: string
  description?: string
  sku: string
  price: number
  cost: number
  stock: number
  minStock: number
  categoryId?: string
}

// Ürün güncelleme isteği
export interface UpdateProductRequest {
  name?: string
  description?: string
  sku?: string
  price?: number
  cost?: number
  stock?: number
  minStock?: number
  categoryId?: string
  isActive?: boolean
}

// Stok hareketi
export interface StockMovement {
  id: string
  productId: string
  product: Product
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  reference?: string
  createdBy: string
  createdAt: Date
}

// Stok hareketi oluşturma
export interface CreateStockMovementRequest {
  productId: string
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  reason: string
  reference?: string
}

// Ürün arama/filtreleme
export interface ProductFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  lowStock?: boolean
  isActive?: boolean
  page?: number
  limit?: number
}

// Ürün listesi response
export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Kategori oluşturma
export interface CreateCategoryRequest {
  name: string
  description?: string
  parentId?: string
}

// Kategori güncelleme
export interface UpdateCategoryRequest {
  name?: string
  description?: string
  parentId?: string
  isActive?: boolean
} 