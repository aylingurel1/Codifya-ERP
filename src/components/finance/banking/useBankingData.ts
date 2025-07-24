"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import type {
  BankAccount,
  Transaction,
  TransactionFilters,
  BankStatement,
} from "./types";

export function useBankingData() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionLimit] = useState(10);
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load bank accounts on component mount
  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log(
        "Fetching bank accounts with token:",
        token ? "Token exists" : "No token"
      );

      const response = await axios.get("/api/finance/v1/banks/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Bank accounts response:", response.data);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.data
      ) {
        setAccounts(response.data.data.data);
      } else {
        console.warn("API'den beklenmeyen format:", response.data);
      }
    } catch (err) {
      setError("Banka hesapları yüklenirken bir hata oluştu.");
      console.error("Banka hesapları yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (filters: TransactionFilters) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (filters.bankAccountId)
        params.append("bankAccountId", filters.bankAccountId);
      if (filters.type) params.append("type", filters.type);
      if (filters.startDate)
        params.append("startDate", filters.startDate.toISOString());
      if (filters.endDate)
        params.append("endDate", filters.endDate.toISOString());
      params.append("page", transactionPage.toString());
      params.append("limit", transactionLimit.toString());

      const response = await axios.get(
        `/api/finance/v1/banks/transactions?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        setTransactions(response.data.data.transactions || []);
        setTransactionTotal(response.data.data.pagination?.total || 0);
      } else {
        console.warn("Transaction API'den beklenmeyen format:", response.data);
      }
    } catch (err) {
      setError("Banka işlemleri yüklenirken bir hata oluştu.");
      console.error("Banka işlemleri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const addBankAccount = async (accountData: {
    bankName: string;
    branch: string;
    iban: string;
    accountNumber: string;
    balance: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/finance/v1/banks/accounts",
        accountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        setAccounts([...accounts, response.data.data]);
        return { success: true };
      } else {
        const newAccountWithId = {
          id: Date.now().toString(),
          ...accountData,
        };
        setAccounts([...accounts, newAccountWithId]);
        return { success: true };
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const message =
          err.response.data.message ||
          "Sunucu tarafında bir validasyon hatası oluştu.";
        return { success: false, error: message };
      } else {
        return {
          success: false,
          error: "Banka hesabı eklenirken beklenmedik bir hata oluştu.",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBankAccount = async (account: BankAccount) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/finance/v1/banks/accounts/${account.id}`,
        account,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAccounts(
          accounts.map((acc) =>
            acc.id === account.id ? response.data.data : acc
          )
        );
        return { success: true };
      }
      return { success: false, error: "Güncelleme başarısız." };
    } catch (err) {
      return { success: false, error: "Hesap güncellenirken bir hata oluştu." };
    } finally {
      setLoading(false);
    }
  };

  const deleteBankAccount = async (accountId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/finance/v1/banks/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Hesap silinirken bir hata oluştu." };
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Transform data to match API schema
      const apiData = {
        ...transactionData,
        amount:
          typeof transactionData.amount === "string"
            ? parseFloat(transactionData.amount)
            : transactionData.amount,
        // Remove empty string fields to let them be undefined
        targetIban: transactionData.targetIban || undefined,
        targetAccountName: transactionData.targetAccountName || undefined,
        targetBankName: transactionData.targetBankName || undefined,
        description: transactionData.description || undefined,
        referenceNumber: transactionData.referenceNumber || undefined,
      };

      const token = localStorage.getItem("token");
      console.log("Data being sent to API:", apiData);
      const response = await axios.post(
        "/api/finance/v1/banks/transactions",
        apiData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        // Yeni oluşturulan işlemi mevcut transactions listesinin başına ekle
        const newTransaction = response.data.data;
        setTransactions((prevTransactions) => [
          newTransaction,
          ...prevTransactions,
        ]);

        // Total sayısını da güncelle
        setTransactionTotal((prevTotal) => prevTotal + 1);

        return { success: true };
      } else {
        return {
          success: false,
          error: "İşlem oluşturuldu ancak beklenmeyen format döndü.",
        };
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("API Error Response:", err.response.data);
        const message =
          err.response.data.error ||
          err.response.data.message ||
          "Sunucu tarafında bir validasyon hatası oluştu.";
        return { success: false, error: message };
      } else {
        return {
          success: false,
          error: "Banka işlemi oluşturulurken beklenmedik bir hata oluştu.",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = async (transactionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/finance/v1/banks/transactions",
        {
          transactionId,
          action: "approve",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        // Onaylanan işlemi mevcut transactions listesinde güncelle
        const updatedTransaction = response.data.data;
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === transactionId ? updatedTransaction : transaction
          )
        );

        return { success: true };
      } else {
        return {
          success: false,
          error: "İşlem onaylandı ancak beklenmeyen format döndü.",
        };
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const message =
          err.response.data.message ||
          "Sunucu tarafında bir validasyon hatası oluştu.";
        return { success: false, error: message };
      } else {
        return {
          success: false,
          error: "Banka işlemi onaylanırken beklenmedik bir hata oluştu.",
        };
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch bank statements
  const fetchBankStatements = async (
    accountId: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    console.log("fetchBankStatements called with:", {
      accountId,
      startDate,
      endDate,
    });

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("accountId", accountId);

      // Only add date parameters if they are not null/undefined
      if (
        startDate &&
        startDate instanceof Date &&
        !isNaN(startDate.getTime())
      ) {
        params.append("startDate", startDate.toISOString().split("T")[0]);
      }
      if (endDate && endDate instanceof Date && !isNaN(endDate.getTime())) {
        params.append("endDate", endDate.toISOString().split("T")[0]);
      }

      console.log(
        "API request URL:",
        `/api/finance/v1/banks/statements?${params.toString()}`
      );
      console.log("API request params:", Object.fromEntries(params));

      const response = await axios.get(
        `/api/finance/v1/banks/statements?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        const statementsData = response.data.data.map((statement: any) => ({
          ...statement,
          statementDate: new Date(statement.statementDate),
          startDate: new Date(statement.startDate),
          endDate: new Date(statement.endDate),
          createdAt: new Date(statement.createdAt),
          updatedAt: new Date(statement.updatedAt),
        }));

        setStatements(statementsData);
        return { success: true, data: statementsData };
      } else {
        setError("Banka ekstreleri getirilemedi.");
        return { success: false, error: "Banka ekstreleri getirilemedi." };
      }
    } catch (err) {
      console.error("Error fetching bank statements:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Banka ekstreleri getirilirken bir hata oluştu";

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Create a new bank statement
  const createBankStatement = async (statementData: {
    bankAccountId: string;
    statementDate: Date;
    startDate: Date;
    endDate: Date;
    balanceStart: number;
    balanceEnd: number;
    statementContent?: any;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/finance/v1/banks/statements",
        {
          ...statementData,
          statementDate: statementData.statementDate.toISOString(),
          startDate: statementData.startDate.toISOString(),
          endDate: statementData.endDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        const newStatement = {
          ...response.data.data,
          statementDate: new Date(response.data.data.statementDate),
          startDate: new Date(response.data.data.startDate),
          endDate: new Date(response.data.data.endDate),
          createdAt: new Date(response.data.data.createdAt),
          updatedAt: new Date(response.data.data.updatedAt),
        };

        setStatements((prev) => [newStatement, ...prev]);
        return { success: true, data: newStatement };
      } else {
        setError("Banka ekstresi oluşturulamadı.");
        return { success: false, error: "Banka ekstresi oluşturulamadı." };
      }
    } catch (err) {
      console.error("Error creating bank statement:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Banka ekstresi oluşturulurken bir hata oluştu";

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const downloadStatement = async (statementId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/finance/v1/banks/statements/${statementId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Dosya indirmek için blob kullan
        }
      );

      // Dosya indirmeyi tetikle
      const blob = new Blob([response.data], {
        type: "text/plain;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Content-Disposition header'ından dosya adını al
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "ekstre.txt";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error("Error downloading statement:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Ekstre indirilirken bir hata oluştu";

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update a bank statement
  const updateBankStatement = async (
    statementId: string,
    statementData: {
      statementDate?: Date;
      startDate?: Date;
      endDate?: Date;
      balanceStart?: number;
      balanceEnd?: number;
      statementContent?: any;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/finance/v1/banks/statements/${statementId}`,
        {
          ...statementData,
          statementDate: statementData.statementDate?.toISOString(),
          startDate: statementData.startDate?.toISOString(),
          endDate: statementData.endDate?.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data) {
        const updatedStatement = {
          ...response.data.data,
          statementDate: new Date(response.data.data.statementDate),
          startDate: new Date(response.data.data.startDate),
          endDate: new Date(response.data.data.endDate),
          createdAt: new Date(response.data.data.createdAt),
          updatedAt: new Date(response.data.data.updatedAt),
        };

        setStatements((prev) =>
          prev.map((statement) =>
            statement.id === statementId ? updatedStatement : statement
          )
        );
        return { success: true, data: updatedStatement };
      } else {
        setError("Banka ekstresi güncellenemedi.");
        return { success: false, error: "Banka ekstresi güncellenemedi." };
      }
    } catch (err) {
      console.error("Error updating bank statement:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Banka ekstresi güncellenirken bir hata oluştu";

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a bank statement
  const deleteBankStatement = async (statementId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `/api/finance/v1/banks/statements/${statementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatements((prev) =>
          prev.filter((statement) => statement.id !== statementId)
        );
        return { success: true };
      } else {
        setError("Banka ekstresi silinemedi.");
        return { success: false, error: "Banka ekstresi silinemedi." };
      }
    } catch (err) {
      console.error("Error deleting bank statement:", err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Banka ekstresi silinirken bir hata oluştu";

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    accounts,
    setAccounts,
    transactions,
    statements,
    transactionPage,
    setTransactionPage,
    transactionLimit,
    transactionTotal,
    loading,
    error,
    setError,
    fetchBankAccounts,
    fetchTransactions,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addTransaction,
    approveTransaction,
    fetchBankStatements,
    createBankStatement,
    downloadStatement,
    updateBankStatement,
    deleteBankStatement,
  };
}
