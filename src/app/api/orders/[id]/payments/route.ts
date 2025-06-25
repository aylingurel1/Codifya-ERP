import { NextRequest } from 'next/server'
import { PaymentService } from '@/modules/accounting/services/paymentService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const paymentService = new PaymentService()

// GET - Sipariş ödeme özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    const orderId = request.nextUrl.pathname.split('/').slice(-2)[0] // orders/[id]/payments
    if (!orderId) {
      return errorResponse('Sipariş ID gerekli')
    }
    
    const summary = await paymentService.getOrderPaymentSummary(orderId)
    return successResponse(summary, 'Sipariş ödeme özeti getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 