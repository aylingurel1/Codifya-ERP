import { NextRequest } from 'next/server'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreateInvoiceRequest, InvoiceFilters, InvoiceStatus, InvoiceType } from '@/modules/accounting/types/invoice'

const invoiceService = new InvoiceService()

// GET - Fatura listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: InvoiceFilters = {
      customerId: searchParams.get('customerId') || undefined,
      status: (searchParams.get('status') as InvoiceStatus) || undefined,
      type: (searchParams.get('type') as InvoiceType) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      dueDateFrom: searchParams.get('dueDateFrom') || undefined,
      dueDateTo: searchParams.get('dueDateTo') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await invoiceService.getInvoices(filters)
    return successResponse(result, 'Faturalar listelendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni fatura oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreateInvoiceRequest = await request.json()
    
    // Validation
    if (!body.type || !body.subtotal) {
      return errorResponse('Fatura tipi ve ara toplam zorunludur')
    }

    // JWT'den userId al
    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }
    
    const invoice = await invoiceService.createInvoice(body, createdBy)
    return successResponse(invoice, 'Fatura başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 