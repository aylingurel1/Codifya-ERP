"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BankAccount, NewTransaction } from "./types";

interface NewTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTransaction: NewTransaction;
  onTransactionChange: (transaction: NewTransaction) => void;
  onAddTransaction: () => void;
  accounts: BankAccount[];
  loading: boolean;
}

export function NewTransactionDialog({
  isOpen,
  onOpenChange,
  newTransaction,
  onTransactionChange,
  onAddTransaction,
  accounts,
  loading,
}: NewTransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2">
          <Plus className="h-4 w-4 mr-2" />
          Yeni İşlem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md data-[state=open]:bg-background">
        <style jsx global>{`
          [data-radix-popper-content-wrapper] {
            z-index: 1000;
          }
          .fixed.inset-0 {
            background: rgba(0, 0, 0, 0.3) !important;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle>Yeni İşlem</DialogTitle>
          <DialogDescription>
            Havale veya EFT işlemi yapmak için aşağıdaki bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionType">İşlem Türü</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(value: string) =>
                onTransactionChange({
                  ...newTransaction,
                  type: value as
                    | "HAVALE"
                    | "EFT"
                    | "VIRMAN"
                    | "TAHSILAT"
                    | "ODEME"
                    | "DIGER",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="İşlem türü seçin">
                  {newTransaction.type
                    ? (() => {
                        const typeLabels: { [key: string]: string } = {
                          HAVALE: "Havale",
                          EFT: "EFT",
                          VIRMAN: "Virman",
                          TAHSILAT: "Tahsilat",
                          ODEME: "Ödeme",
                          DIGER: "Diğer",
                        };
                        return (
                          typeLabels[newTransaction.type] || newTransaction.type
                        );
                      })()
                    : "İşlem türü seçin"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="bankAccount">Gönderen Hesap</Label>
            <Select
              value={newTransaction.bankAccountId}
              onValueChange={(value) =>
                onTransactionChange({
                  ...newTransaction,
                  bankAccountId: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Hesap seçin">
                  {newTransaction.bankAccountId
                    ? accounts.find(
                        (acc) => acc.id === newTransaction.bankAccountId
                      )?.bankName +
                      " - " +
                      accounts.find(
                        (acc) => acc.id === newTransaction.bankAccountId
                      )?.iban
                    : "Hesap seçin"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="targetIban">Alıcı IBAN</Label>
            <Input
              id="targetIban"
              value={newTransaction.targetIban}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  targetIban: e.target.value,
                })
              }
              placeholder="TR64 0006 4000 0011 2345 6789 01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAccountName">Alıcı Hesap Adı</Label>
            <Input
              id="targetAccountName"
              value={newTransaction.targetAccountName}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  targetAccountName: e.target.value,
                })
              }
              placeholder="Alıcı adı"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetBankName">Alıcı Banka Adı</Label>
            <Input
              id="targetBankName"
              value={newTransaction.targetBankName}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  targetBankName: e.target.value,
                })
              }
              placeholder="Banka adı"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Tutar (₺)</Label>
            <Input
              id="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  amount: e.target.value,
                })
              }
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">
              Referans Numarası
              <span className="text-sm text-gray-500 ml-1">
                (Boş bırakılırsa otomatik oluşturulur)
              </span>
            </Label>
            <Input
              id="referenceNumber"
              value={newTransaction.referenceNumber}
              onChange={(e) =>
                onTransactionChange({
                  ...newTransaction,
                  referenceNumber: e.target.value,
                })
              }
              placeholder="Boş bırakabilirsiniz - otomatik oluşturulacak"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={newTransaction.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onTransactionChange({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              placeholder="İşlem açıklaması"
            />
          </div>
          <Button
            onClick={onAddTransaction}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
            disabled={loading}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
