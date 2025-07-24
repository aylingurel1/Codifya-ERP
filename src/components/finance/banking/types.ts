export interface BankAccount {
  id: string;
  bankName: string;
  branch: string;
  iban: string;
  accountNumber: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "HAVALE" | "EFT" | "VIRMAN" | "TAHSILAT" | "ODEME" | "DIGER";
  amount: number;
  currency: string;
  description?: string;
  bankAccountId: string;
  targetIban?: string;
  targetAccountName?: string;
  targetBankName?: string;
  referenceNumber?: string;
  transactionDate: Date;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  bankAccount?: {
    id: string;
    bankName: string;
    iban: string;
    currency: string;
  };
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  approvedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TransactionFilters {
  bankAccountId: string;
  type: "" | "HAVALE" | "EFT" | "VIRMAN" | "TAHSILAT" | "ODEME" | "DIGER";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface StatementFilters {
  selectedAccount: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface BankStatement {
  id: string;
  bankAccountId: string;
  statementDate: Date;
  startDate: Date;
  endDate: Date;
  balanceStart: number;
  balanceEnd: number;
  statementContent?: any;
  createdAt: Date;
  updatedAt: Date;
  bankAccount?: {
    id: string;
    bankName: string;
    iban: string;
    currency: string;
  };
}

export interface NewAccount {
  bankName: string;
  branch: string;
  iban: string;
  accountNumber: string;
}

export interface NewTransaction {
  type: "HAVALE" | "EFT" | "VIRMAN" | "TAHSILAT" | "ODEME" | "DIGER";
  bankAccountId: string;
  targetIban: string;
  targetAccountName: string;
  targetBankName: string;
  amount: string; // Form input string olarak geliyor, API'de number'a dönüştürülecek
  currency: string;
  description: string;
  referenceNumber: string; // Boş bırakılırsa backend otomatik oluşturur
}
