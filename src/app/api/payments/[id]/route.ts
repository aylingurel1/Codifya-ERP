import { NextRequest } from 'next/server'
import { PaymentService } from '@/modules/accounting/services/paymentService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { UpdatePaymentRequest, PaymentMethod, PaymentStatus } from '@/modules/accounting/types/payment'

const paymentService = new PaymentService()

// GET - Ödeme detayı
async function handleGet(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ödeme ID gerekli')
    }
    
    const payment = await paymentService.getPaymentById(id)
    return successResponse(payment, 'Ödeme detayı getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// PUT - Ödeme güncelleme
async function handlePut(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ödeme ID gerekli')
    }
    
    const body: UpdatePaymentRequest = await request.json()
    
    // Validation
    if (body.amount && body.amount <= 0) {
      return errorResponse('Ödeme tutarı 0\'dan büyük olmalıdır')
    }

    if (body.method && !['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK'].includes(body.method)) {
      return errorResponse('Geçerli bir ödeme yöntemi seçin')
    }

    if (body.status && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(body.status)) {
      return errorResponse('Geçerli bir ödeme durumu seçin')
    }

    const payment = await paymentService.updatePayment(id, body)
    return successResponse(payment, 'Ödeme başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// DELETE - Ödeme silme
async function handleDelete(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Ödeme ID gerekli')
    }
    
    const result = await paymentService.deletePayment(id)
    return successResponse(result, 'Ödeme başarıyla silindi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const PUT = requireManager(handlePut)
export const DELETE = requireManager(handleDelete) 