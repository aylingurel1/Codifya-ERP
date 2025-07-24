"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewTransactionDialog } from "./NewTransactionDialog";
import { TransactionFiltersComponent } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { Pagination } from "./Pagination";
import type {
  BankAccount,
  Transaction,
  TransactionFilters,
  NewTransaction,
} from "./types";

interface TransactionsTabProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  newTransaction: NewTransaction;
  onNewTransactionChange: (transaction: NewTransaction) => void;
  isNewTransactionOpen: boolean;
  onNewTransactionOpenChange: (open: boolean) => void;
  onAddTransaction: () => void;

  transactionFilters: TransactionFilters;
  onTransactionFiltersChange: (filters: TransactionFilters) => void;
  onApproveTransaction: (transactionId: string) => void;

  transactionPage: number;
  transactionLimit: number;
  transactionTotal: number;
  onTransactionPageChange: (page: number) => void;

  loading: boolean;
}

export function TransactionsTab({
  accounts,
  transactions,
  newTransaction,
  onNewTransactionChange,
  isNewTransactionOpen,
  onNewTransactionOpenChange,
  onAddTransaction,
  transactionFilters,
  onTransactionFiltersChange,
  onApproveTransaction,
  transactionPage,
  transactionLimit,
  transactionTotal,
  onTransactionPageChange,
  loading,
}: TransactionsTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Banka İşlemleri
        </h2>
        <NewTransactionDialog
          isOpen={isNewTransactionOpen}
          onOpenChange={onNewTransactionOpenChange}
          newTransaction={newTransaction}
          onTransactionChange={onNewTransactionChange}
          onAddTransaction={onAddTransaction}
          accounts={accounts}
          loading={loading}
        />
      </div>

      <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900">İşlem Geçmişi</CardTitle>
          <CardDescription className="text-gray-600">
            Son yapılan banka işlemleri (varsayılan olarak son 24 saatin
            hareketleri gösterilir)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionFiltersComponent
            filters={transactionFilters}
            onFiltersChange={onTransactionFiltersChange}
            accounts={accounts}
          />

          <TransactionTable
            transactions={transactions}
            onApproveTransaction={onApproveTransaction}
            loading={loading}
          />

          <Pagination
            currentPage={transactionPage}
            totalItems={transactionTotal}
            itemsPerPage={transactionLimit}
            onPageChange={onTransactionPageChange}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
