import { NextRequest } from 'next/server'
import { CustomerService } from '@/modules/crm/services/customerService'
import { successResponse, errorResponse, createPaginationMeta } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreateCustomerRequest, CustomerFilters } from '@/modules/crm/types'

const customerService = new CustomerService()

// GET - Müşteri listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: CustomerFilters = {
      search: searchParams.get('search') || undefined,
      company: searchParams.get('company') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await customerService.getCustomers(filters)
    const meta = createPaginationMeta(result.page, result.limit, result.total)
    
    return successResponse(result.customers, 'Müşteriler listelendi', meta)
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni müşteri oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreateCustomerRequest = await request.json()
    
    // Validation
    if (!body.name) {
      return errorResponse('Müşteri adı zorunludur')
    }

    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }
    
    const customer = await customerService.createCustomer(body, createdBy)
    return successResponse(customer, 'Müşteri başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 