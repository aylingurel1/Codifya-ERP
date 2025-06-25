import { NextRequest } from 'next/server'
import { PaymentService } from '@/modules/accounting/services/paymentService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { PaymentStatus } from '@/modules/accounting/types/payment'

const paymentService = new PaymentService()

// PATCH - Ödeme durumu güncelleme
async function handlePatch(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').slice(-2)[0] // payments/[id]/status
    if (!id) {
      return errorResponse('Ödeme ID gerekli')
    }
    
    const body = await request.json()
    const { status } = body
    
    if (!status || !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      return errorResponse('Geçerli bir ödeme durumu gerekli')
    }

    const payment = await paymentService.updatePaymentStatus(id, status as PaymentStatus)
    return successResponse(payment, 'Ödeme durumu başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const PATCH = requireManager(handlePatch) 