import { NextRequest } from 'next/server'
import { ProductService } from '@/modules/inventory/services/productService'
import { successResponse, errorResponse, notFoundResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { UpdateProductRequest } from '@/modules/inventory/types'

const productService = new ProductService()

// GET - Tekil ürün detayı
async function handleGet(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ürün ID gerekli')
    }

    const product = await productService.getProductById(id)
    return successResponse(product)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Ürün bulunamadı') {
        return notFoundResponse()
      }
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// PUT - Ürün güncelleme
async function handlePut(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ürün ID gerekli')
    }

    const body: UpdateProductRequest = await request.json()
    
    // Validation
    if (body.price !== undefined && body.price < 0) {
      return errorResponse('Fiyat negatif olamaz')
    }

    if (body.cost !== undefined && body.cost < 0) {
      return errorResponse('Maliyet negatif olamaz')
    }

    if (body.stock !== undefined && body.stock < 0) {
      return errorResponse('Stok miktarı negatif olamaz')
    }

    const product = await productService.updateProduct(id, body)
    return successResponse(product, 'Ürün başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Ürün bulunamadı') {
        return notFoundResponse()
      }
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// DELETE - Ürün silme
async function handleDelete(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ürün ID gerekli')
    }

    const result = await productService.deleteProduct(id)
    return successResponse(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Ürün bulunamadı') {
        return notFoundResponse()
      }
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const PUT = requireManager(handlePut)
export const DELETE = requireManager(handleDelete) 