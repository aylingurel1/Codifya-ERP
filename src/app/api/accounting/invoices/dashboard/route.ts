import { NextRequest } from 'next/server'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const invoiceService = new InvoiceService()

// GET - Fatura dashboard özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    const summary = await invoiceService.getInvoiceSummary()
    return successResponse(summary, 'Fatura dashboard verileri getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 