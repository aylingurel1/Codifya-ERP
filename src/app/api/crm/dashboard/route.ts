import { NextRequest } from 'next/server'
import { CustomerService } from '@/modules/crm/services/customerService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const customerService = new CustomerService()

// GET - CRM Dashboard istatistikleri
async function handleGet(request: AuthenticatedRequest) {
  try {
    const stats = await customerService.getCustomerStats()
    return successResponse(stats, 'CRM dashboard verileri getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 