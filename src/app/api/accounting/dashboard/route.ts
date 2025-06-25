import { NextRequest } from 'next/server'
import { TransactionService } from '@/modules/accounting/services/transactionService'
import { InvoiceService } from '@/modules/accounting/services/invoiceService'
import { PaymentService } from '@/modules/accounting/services/paymentService'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { logger } from '@/utils/logger'

const transactionService = new TransactionService()
const invoiceService = new InvoiceService()
const paymentService = new PaymentService()

// GET - Accounting dashboard özeti
async function handleGet(request: AuthenticatedRequest) {
  try {
    // Tüm istatistikleri paralel olarak al
    const [transactionStats, invoiceStats, paymentStats] = await Promise.all([
      transactionService.getTransactionStats(),
      invoiceService.getInvoiceStats(),
      paymentService.getPaymentStats()
    ])

    // Genel accounting istatistikleri
    const accountingStats = {
      totalRevenue: transactionStats.totalIncome,
      totalExpenses: transactionStats.totalExpenses,
      netProfit: transactionStats.netProfit,
      outstandingInvoices: invoiceStats.pendingInvoices + invoiceStats.overdueInvoices,
      overdueInvoices: invoiceStats.overdueInvoices,
      totalPayments: paymentStats.totalPayments,
      pendingPayments: paymentStats.pendingPayments,
      monthlyRevenue: transactionStats.monthlyTransactions.map(t => ({
        month: t.month,
        revenue: t.income,
        expenses: t.expenses,
        profit: t.profit
      })),
      topCustomers: [], // Bu kısım ayrı bir endpoint'te implement edilebilir
      paymentMethods: paymentStats.paymentMethods
    }

    const dashboardData = {
      accountingStats,
      transactionStats,
      invoiceStats,
      paymentStats
    }

    logger.info('Accounting dashboard verileri getirildi')
    return successResponse(dashboardData, 'Accounting dashboard verileri getirildi')
  } catch (error) {
    logger.error('Accounting dashboard hatası', { error })
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet) 