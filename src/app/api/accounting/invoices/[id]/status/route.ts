import { NextRequest } from 'next/server'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { InvoiceStatus } from '@/modules/accounting/types/invoice'

const invoiceService = new InvoiceService()

// PATCH - Fatura durumunu güncelle
async function handlePatch(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').slice(-2)[0]
    if (!id) {
      return errorResponse('Fatura ID gerekli')
    }
    const body = await request.json()
    const { status } = body
    if (!status || !['DRAFT', 'SENT', 'PAID', 'CANCELLED'].includes(status)) {
      return errorResponse('Geçerli bir fatura durumu gerekli')
    }
    const invoice = await invoiceService.updateInvoiceStatus(id, status as InvoiceStatus)
    return successResponse(invoice, 'Fatura durumu başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const PATCH = requireManager(handlePatch) 