import { NextRequest } from 'next/server'
import { ProductService } from '@/modules/inventory/services/productService'
import { StockService } from '@/modules/inventory/services/stockService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager } from '@/lib/auth'

const productService = new ProductService()
const stockService = new StockService()

// GET - Inventory dashboard özeti
async function handleGet(request: NextRequest) {
  try {
    const [lowStockProducts, stockSummary] = await Promise.all([
      productService.getLowStockProducts(),
      stockService.getStockSummary()
    ])

    const dashboard = {
      stockSummary,
      lowStockProducts,
      alerts: {
        lowStockCount: lowStockProducts.length,
        outOfStockCount: stockSummary.outOfStockProducts
      }
    }

    return successResponse(dashboard)
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 