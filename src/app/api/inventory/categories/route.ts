import { NextRequest } from 'next/server'
import { CategoryService } from '@/modules/inventory/services/categoryService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreateCategoryRequest } from '@/modules/inventory/types'

const categoryService = new CategoryService()

// GET - Kategori listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'
    
    let categories
    if (tree) {
      categories = await categoryService.getCategoryTree()
    } else {
      categories = await categoryService.getAllCategories()
    }

    return successResponse(categories)
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni kategori oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreateCategoryRequest = await request.json()
    
    // Validation
    if (!body.name) {
      return errorResponse('Kategori adı zorunludur')
    }

    const category = await categoryService.createCategory(body)
    return successResponse(category, 'Kategori başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 