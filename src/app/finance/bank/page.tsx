"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, Building2 } from "lucide-react";
import {
  BankAccountsTab,
  TransactionsTab,
  StatementsTab,
  BankStatements,
  useBankingData,
} from "@/components/finance/banking";
import type {
  NewTransaction,
  TransactionFilters,
  StatementFilters,
} from "@/components/finance/banking/types";

// Varsayılan tarih aralığını hesaplayan yardımcı fonksiyon
const getDefaultDateRange = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return {
    startDate: yesterday,
    endDate: today,
  };
};

export default function BankingDashboard() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Varsayılan olarak true yap

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Token yoksa kullanıcıyı uyar ama yönlendirme
      console.warn("Token bulunamadı, test modunda çalışıyor");
      setIsAuthenticated(true); // Test için true bırak
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Banking data hook
  const {
    accounts,
    transactions,
    statements,
    transactionPage,
    setTransactionPage,
    transactionLimit,
    transactionTotal,
    loading,
    error,
    fetchBankAccounts,
    fetchTransactions,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addTransaction,
    approveTransaction,
    fetchBankStatements,
    createBankStatement,
  } = useBankingData();

  // Transaction state
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: "HAVALE",
    bankAccountId: "",
    targetIban: "",
    targetAccountName: "",
    targetBankName: "",
    amount: "0",
    currency: "TRY",
    description: "",
    referenceNumber: "",
  });
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  // Varsayılan tarih aralığını al (dün-bugün)
  const defaultDateRange = getDefaultDateRange();

  const [transactionFilters, setTransactionFilters] =
    useState<TransactionFilters>({
      bankAccountId: "",
      type: "",
      startDate: defaultDateRange.startDate,
      endDate: defaultDateRange.endDate,
    });

  // Statement state - burada da varsayılan tarihleri kullanalım
  const [statementFilters, setStatementFilters] = useState<StatementFilters>({
    selectedAccount: "",
    startDate: defaultDateRange.startDate,
    endDate: defaultDateRange.endDate,
  });

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // FIX 1: Fetch bank accounts on initial load
      fetchBankAccounts();
      fetchTransactions(transactionFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // This should run once when authentication is confirmed

  // Handlers
  const handleNewTransactionChange = (transaction: NewTransaction) => {
    setNewTransaction(transaction);
  };

  const handleAddTransaction = async () => {
    const result = await addTransaction(newTransaction);
    if (result.success) {
      setIsNewTransactionOpen(false);
      setNewTransaction({
        type: "HAVALE",
        bankAccountId: "",
        targetIban: "",
        targetAccountName: "",
        targetBankName: "",
        amount: "0",
        currency: "TRY",
        description: "",
        referenceNumber: "",
      });
      // State will update automatically via the hook, no need to re-fetch
    }
  };

  const handleTransactionFiltersChange = (filters: TransactionFilters) => {
    setTransactionFilters(filters);
    fetchTransactions(filters);
  };

  const handleApproveTransaction = async (transactionId: string) => {
    await approveTransaction(transactionId);
    // State will update automatically via the hook
  };

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <div className="w-[90%] max-w-[1600px] mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="w-[90%] max-w-[1600px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Banka Yönetim Sistemi
          </h1>
          <p className="text-gray-600">
            Hesaplarınızı yönetin, işlem yapın ve ekstrelerinizi alın
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 border rounded-lg">
            <TabsTrigger
              value="accounts"
              className="flex items-center gap-2 text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-md py-3"
            >
              <Building2 className="h-4 w-4" />
              Banka Hesapları
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2 text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-md py-3"
            >
              <Send className="h-4 w-4" />
              Banka İşlemleri
            </TabsTrigger>
            <TabsTrigger
              value="statements"
              className="flex items-center gap-2 text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-md py-3"
            >
              <FileText className="h-4 w-4" />
              Ekstreler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <BankAccountsTab />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab
              accounts={accounts}
              transactions={transactions}
              newTransaction={newTransaction}
              onNewTransactionChange={handleNewTransactionChange}
              isNewTransactionOpen={isNewTransactionOpen}
              onNewTransactionOpenChange={setIsNewTransactionOpen}
              onAddTransaction={handleAddTransaction}
              transactionFilters={transactionFilters}
              onTransactionFiltersChange={handleTransactionFiltersChange}
              onApproveTransaction={handleApproveTransaction}
              transactionPage={transactionPage}
              transactionLimit={transactionLimit}
              transactionTotal={transactionTotal}
              onTransactionPageChange={setTransactionPage}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="statements">
            <BankStatements />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
