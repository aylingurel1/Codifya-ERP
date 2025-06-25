import { NextRequest } from 'next/server'
import { TransactionService } from '@/modules/accounting/services/transactionService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { CreateTransactionRequest, TransactionFilters, TransactionType, TransactionCategory } from '@/modules/accounting/types/transaction'

const transactionService = new TransactionService()

// GET - Transaction listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: TransactionFilters = {
      type: (searchParams.get('type') as TransactionType) || undefined,
      category: (searchParams.get('category') as TransactionCategory) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      minAmount: searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined,
      maxAmount: searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await transactionService.getTransactions(filters)
    return successResponse(result, 'İşlemler listelendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni transaction oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body: CreateTransactionRequest = await request.json()
    
    // Validation
    if (!body.description || !body.amount || !body.type || !body.category) {
      return errorResponse('Açıklama, tutar, tür ve kategori zorunludur')
    }

    if (body.amount <= 0) {
      return errorResponse('Tutar 0\'dan büyük olmalıdır')
    }

    if (!['INCOME', 'EXPENSE'].includes(body.type)) {
      return errorResponse('Geçerli bir işlem türü seçin')
    }

    if (!['SALES', 'PURCHASE', 'SALARY', 'RENT', 'UTILITIES', 'MARKETING', 'OTHER'].includes(body.category)) {
      return errorResponse('Geçerli bir kategori seçin')
    }

    // JWT'den userId al
    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }
    
    const transaction = await transactionService.createTransaction(body, createdBy)
    return successResponse(transaction, 'İşlem başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 