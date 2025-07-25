import { NextRequest } from 'next/server'
import { OrderService } from '@/modules/orders/services/orderService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const orderService = new OrderService()

// GET - Sipariş dashboard özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    const stats = await orderService.getOrderStats()
    return successResponse(stats, 'Orders dashboard verileri getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 