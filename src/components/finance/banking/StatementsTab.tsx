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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
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
  onDownloadStatement?: (
    statementId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function StatementsTab({
  accounts,
  statements,
  loading,
  onFetchStatements,
  onCreateStatement,
  onDownloadStatement,
}: StatementsTabProps) {
  console.log("StatementsTab rendered with accounts:", accounts.length);

  const [statementFilters, setStatementFilters] = useState<StatementFilters>({
    selectedAccount: "",
    startDate: undefined,
    endDate: undefined,
  });

  const handleGetStatement = async () => {
    if (
      statementFilters.selectedAccount &&
      statementFilters.startDate &&
      statementFilters.endDate
    ) {
      await onFetchStatements(
        statementFilters.selectedAccount,
        statementFilters.startDate,
        statementFilters.endDate
      );
    }
  };

  const handleDownloadStatement = async (statementId: string) => {
    if (onDownloadStatement) {
      try {
        const result = await onDownloadStatement(statementId);
        if (!result.success) {
          console.error("Ekstre indirme hatası:", result.error);
          // Burada kullanıcıya hata mesajı gösterebilirsiniz
        }
      } catch (error) {
        console.error("Ekstre indirme hatası:", error);
      }
    } else {
      // Geçici olarak bir PDF dosyası oluşturma simülasyonu
      const statement = statements.find((s) => s.id === statementId);
      if (statement) {
        const account = accounts.find(
          (acc) => acc.id === statement.bankAccountId
        );
        const fileName = `ekstre_${account?.bankName}_${format(
          new Date(statement.startDate),
          "yyyy-MM"
        )}.pdf`;

        // Basit bir metin dosyası oluşturup indirme
        const content = `Banka Ekstresi\n\nBanka: ${
          account?.bankName
        }\nHesap: ${account?.iban}\nTarih Aralığı: ${format(
          new Date(statement.startDate),
          "dd/MM/yyyy"
        )} - ${format(
          new Date(statement.endDate),
          "dd/MM/yyyy"
        )}\nBaşlangıç Bakiyesi: ${statement.balanceStart.toLocaleString(
          "tr-TR"
        )} TRY\nBitiş Bakiyesi: ${statement.balanceEnd.toLocaleString(
          "tr-TR"
        )} TRY`;

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Banka Ekstreleri</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ekstre Al</CardTitle>
          <CardDescription>
            Belirli bir tarih aralığında hesap ekstrenizi alın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Banka Hesabı</Label>
              <Select
                value={statementFilters.selectedAccount}
                onValueChange={(value) =>
                  setStatementFilters({
                    ...statementFilters,
                    selectedAccount: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hesap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem
                      key={account.id}
                      value={account.id}
                      className="max-w-full"
                    >
                      <div className="truncate">
                        {account.bankName} - {account.iban}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent min-h-[40px] px-3"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {statementFilters.startDate
                        ? format(statementFilters.startDate, "dd/MM/yyyy", {
                            locale: tr,
                          })
                        : "Tarih seçin"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={statementFilters.startDate}
                    onSelect={(date) =>
                      setStatementFilters({
                        ...statementFilters,
                        startDate: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent min-h-[40px] px-3"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {statementFilters.endDate
                        ? format(statementFilters.endDate, "dd/MM/yyyy", {
                            locale: tr,
                          })
                        : "Tarih seçin"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={statementFilters.endDate}
                    onSelect={(date) =>
                      setStatementFilters({
                        ...statementFilters,
                        endDate: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            onClick={handleGetStatement}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            disabled={
              loading ||
              !statementFilters.selectedAccount ||
              !statementFilters.startDate ||
              !statementFilters.endDate
            }
          >
            <Download className="h-4 w-4" />
            {loading ? "Ekstre alınıyor..." : "Ekstre Al"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son Ekstreler</CardTitle>
          <CardDescription>Daha önce alınmış ekstreler</CardDescription>
        </CardHeader>
        <CardContent>
          {statements.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="space-y-3 min-w-0">
                {statements.map((statement) => (
                  <div
                    key={statement.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-4"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium truncate text-sm sm:text-base">
                        {
                          accounts.find(
                            (acc) => acc.id === statement.bankAccountId
                          )?.bankName
                        }{" "}
                        -{" "}
                        {new Date(statement.statementDate).toLocaleDateString(
                          "tr-TR",
                          { month: "long", year: "numeric" }
                        )}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {format(new Date(statement.startDate), "dd/MM/yyyy")} -{" "}
                        {format(new Date(statement.endDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadStatement(statement.id)}
                      disabled={loading}
                      className="shrink-0 w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? "İndiriliyor..." : "İndir"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Henüz ekstre bulunmamaktadır.
              </p>
              <p className="text-sm text-gray-400">
                Yukarıdaki formu kullanarak ekstre alabilirsiniz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
