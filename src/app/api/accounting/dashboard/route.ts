import { NextRequest } from 'next/server'
import { TransactionService } from '@/modules/accounting/services/transactionService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'

const transactionService = new TransactionService()

// GET - Finansal dashboard özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    const summary = await transactionService.getFinancialSummary()
    return successResponse(summary, 'Finansal özet getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 