"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { BankAccount, TransactionFilters } from "./types";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  accounts: BankAccount[];
}

export function TransactionFiltersComponent({
  filters,
  onFiltersChange,
  accounts,
}: TransactionFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="filterBankAccount">Banka Hesabı</Label>
        <Select
          value={filters.bankAccountId}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              bankAccountId: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tüm hesaplar">
              {filters.bankAccountId
                ? accounts.find((acc) => acc.id === filters.bankAccountId)
                    ?.bankName +
                  " - " +
                  accounts.find((acc) => acc.id === filters.bankAccountId)?.iban
                : "Tüm hesaplar"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm hesaplar</SelectItem>
            {Array.isArray(accounts) &&
              accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.bankName} - {account.iban}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="filterType">İşlem Türü</Label>
        <Select
          value={filters.type}
          onValueChange={(value: any) =>
            onFiltersChange({
              ...filters,
              type: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tüm türler">
              {filters.type
                ? (() => {
                    const typeLabels: { [key: string]: string } = {
                      HAVALE: "Havale",
                      EFT: "EFT",
                      VIRMAN: "Virman",
                      TAHSILAT: "Tahsilat",
                      ODEME: "Ödeme",
                      DIGER: "Diğer",
                    };
                    return typeLabels[filters.type] || filters.type;
                  })()
                : "Tüm türler"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm türler</SelectItem>
            <SelectItem value="HAVALE">Havale</SelectItem>
            <SelectItem value="EFT">EFT</SelectItem>
            <SelectItem value="VIRMAN">Virman</SelectItem>
            <SelectItem value="TAHSILAT">Tahsilat</SelectItem>
            <SelectItem value="ODEME">Ödeme</SelectItem>
            <SelectItem value="DIGER">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Başlangıç Tarihi</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                <>
                  {format(filters.startDate, "dd/MM/yyyy", {
                    locale: tr,
                  })}
                  {/* Eğer dün ise özel mesaj göster */}
                  {new Date(filters.startDate).toDateString() ===
                  new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
                    ? " (Dün)"
                    : ""}
                </>
              ) : (
                <span>Tarih seçin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.startDate}
              onSelect={(date) =>
                onFiltersChange({
                  ...filters,
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
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? (
                <>
                  {format(filters.endDate, "dd/MM/yyyy", {
                    locale: tr,
                  })}
                  {/* Eğer bugün ise özel mesaj göster */}
                  {new Date(filters.endDate).toDateString() ===
                  new Date().toDateString()
                    ? " (Bugün)"
                    : ""}
                </>
              ) : (
                <span>Tarih seçin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.endDate}
              onSelect={(date) =>
                onFiltersChange({
                  ...filters,
                  endDate: date,
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
