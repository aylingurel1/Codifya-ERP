import { NextRequest } from 'next/server'
import { PaymentService } from '@/modules/accounting/services/paymentService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreatePaymentRequest, PaymentFilters, PaymentMethod, PaymentStatus } from '@/modules/accounting/types/payment'

const paymentService = new PaymentService()

// GET - Ödeme listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: PaymentFilters = {
      orderId: searchParams.get('orderId') || undefined,
      status: (searchParams.get('status') as PaymentStatus) || undefined,
      method: (searchParams.get('method') as PaymentMethod) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await paymentService.getPayments(filters)
    return successResponse(result, 'Ödemeler listelendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni ödeme oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreatePaymentRequest = await request.json()
    
    // Validation
    if (!body.orderId || !body.amount || !body.method) {
      return errorResponse('Sipariş ID, tutar ve ödeme yöntemi zorunludur')
    }

    if (body.amount <= 0) {
      return errorResponse('Ödeme tutarı 0\'dan büyük olmalıdır')
    }

    if (!['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK'].includes(body.method)) {
      return errorResponse('Geçerli bir ödeme yöntemi seçin')
    }
    
    const payment = await paymentService.createPayment(body)
    return successResponse(payment, 'Ödeme başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 