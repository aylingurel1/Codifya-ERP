import { NextRequest } from 'next/server'
import { CustomerService } from '@/modules/crm/services/customerService'
import { successResponse, errorResponse, notFoundResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const customerService = new CustomerService()

// GET - Müşteri geçmişi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').slice(-2)[0] // /customers/[id]/history
    if (!id) {
      return notFoundResponse()
    }

    const history = await customerService.getCustomerHistory(id)
    return successResponse(history, 'Müşteri geçmişi getirildi')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Müşteri bulunamadı') {
        return notFoundResponse()
      }
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 