import { NextRequest } from 'next/server'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { UpdateInvoiceRequest, InvoiceStatus } from '@/modules/accounting/types/invoice'

const invoiceService = new InvoiceService()

// GET - Fatura detayı
async function handleGet(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Fatura ID gerekli')
    }
    
    const invoice = await invoiceService.getInvoiceById(id)
    return successResponse(invoice, 'Fatura detayı getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// PUT - Fatura güncelleme
async function handlePut(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Fatura ID gerekli')
    }
    
    const body: UpdateInvoiceRequest = await request.json()
    const invoice = await invoiceService.updateInvoice(id, body)
    return successResponse(invoice, 'Fatura başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// DELETE - Fatura silme
async function handleDelete(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('Fatura ID gerekli')
    }
    
    const result = await invoiceService.deleteInvoice(id)
    return successResponse(result, 'Fatura başarıyla silindi')
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