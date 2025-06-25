import { NextRequest } from 'next/server'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const invoiceService = new InvoiceService()

// POST - Siparişten fatura oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { orderId } = body
    if (!orderId) {
      return errorResponse('Sipariş ID zorunludur')
    }
    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }
    const invoice = await invoiceService.createInvoiceFromOrder(orderId, createdBy)
    return successResponse(invoice, 'Siparişten fatura başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const POST = requireManager(handlePost) 