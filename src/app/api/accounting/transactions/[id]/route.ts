import { NextRequest } from 'next/server'
import { TransactionService } from '@/modules/accounting/services/transactionService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { UpdateTransactionRequest, TransactionType, TransactionCategory } from '@/modules/accounting/types/transaction'

const transactionService = new TransactionService()

// GET - Transaction detayı
async function handleGet(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('İşlem ID gerekli')
    }
    
    const transaction = await transactionService.getTransactionById(id)
    return successResponse(transaction, 'İşlem detayı getirildi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// PUT - Transaction güncelleme
async function handlePut(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('İşlem ID gerekli')
    }
    
    const body: UpdateTransactionRequest = await request.json()
    
    // Validation
    if (body.amount && body.amount <= 0) {
      return errorResponse('Tutar 0\'dan büyük olmalıdır')
    }

    if (body.type && !['INCOME', 'EXPENSE'].includes(body.type)) {
      return errorResponse('Geçerli bir işlem türü seçin')
    }

    if (body.category && !['SALES', 'PURCHASE', 'SALARY', 'RENT', 'UTILITIES', 'MARKETING', 'OTHER'].includes(body.category)) {
      return errorResponse('Geçerli bir kategori seçin')
    }

    const transaction = await transactionService.updateTransaction(id, body)
    return successResponse(transaction, 'İşlem başarıyla güncellendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// DELETE - Transaction silme
async function handleDelete(request: AuthenticatedRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) {
      return errorResponse('İşlem ID gerekli')
    }
    
    const result = await transactionService.deleteTransaction(id)
    return successResponse(result, 'İşlem başarıyla silindi')
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