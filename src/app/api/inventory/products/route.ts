import { NextRequest } from 'next/server'
import { ProductService } from '@/modules/inventory/services/productService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreateProductRequest, ProductFilters } from '@/modules/inventory/types'

const productService = new ProductService()

// GET - Ürün listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: ProductFilters = {
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      lowStock: searchParams.get('lowStock') ? searchParams.get('lowStock') === 'true' : undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await productService.getProducts(filters)
    return successResponse(result)
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni ürün oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreateProductRequest = await request.json()
    
    // Validation
    if (!body.name || !body.sku || body.price === undefined || body.cost === undefined) {
      return errorResponse('Name, SKU, price ve cost alanları zorunludur')
    }

    if (body.price < 0 || body.cost < 0) {
      return errorResponse('Fiyat ve maliyet negatif olamaz')
    }

    if (body.stock < 0) {
      return errorResponse('Stok miktarı negatif olamaz')
    }

    // JWT'den userId al
    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }
    
    const product = await productService.createProduct(body, createdBy)
    return successResponse(product, 'Ürün başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 