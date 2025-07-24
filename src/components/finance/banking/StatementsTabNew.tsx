"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BankAccount, StatementFilters, BankStatement } from "./types";

interface StatementsTabProps {
  accounts: BankAccount[];
  statements: BankStatement[];
  loading: boolean;
  onFetchStatements: (
    accountId: string,
    startDate?: Date,
    endDate?: Date
  ) => Promise<{ success: boolean; data?: BankStatement[]; error?: string }>;
  onCreateStatement: (data: {
    bankAccountId: string;
    statementDate: Date;
    startDate: Date;
    endDate: Date;
    balanceStart: number;
    balanceEnd: number;
  }) => Promise<{ success: boolean; data?: BankStatement; error?: string }>;
}

export function StatementsTab({
  accounts,
  statements,
  loading,
  onFetchStatements,
  onCreateStatement,
}: StatementsTabProps) {
  const [statementFilters, setStatementFilters] = useState<StatementFilters>({
    selectedAccount: "",
    startDate: undefined,
    endDate: undefined,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banka Ekstreleri</CardTitle>
          <CardDescription>
            Hesap ekstre bilgilerinizi görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Hesap Seçin</label>
              <Select
                value={statementFilters.selectedAccount}
                onValueChange={(value) =>
                  setStatementFilters((prev) => ({
                    ...prev,
                    selectedAccount: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hesap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bankName} - {account.iban}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  if (statementFilters.selectedAccount) {
                    onFetchStatements(statementFilters.selectedAccount);
                  }
                }}
                disabled={!statementFilters.selectedAccount || loading}
              >
                {loading ? "Yükleniyor..." : "Ekstre Getir"}
              </Button>
            </div>
          </div>

          {statements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Ekstre Listesi</h3>
              <div className="space-y-2">
                {statements.map((statement) => (
                  <Card key={statement.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Ekstre #{statement.id}</p>
                          <p className="text-sm text-gray-600">
                            Tarih:{" "}
                            {new Date(
                              statement.statementDate
                            ).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            Başlangıç: ₺
                            {statement.balanceStart.toLocaleString("tr-TR")}
                          </p>
                          <p className="text-sm">
                            Bitiş: ₺
                            {statement.balanceEnd.toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
