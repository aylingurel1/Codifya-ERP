"use client";

import { Building2, Plus } from "lucide-react";
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
import type { NewAccount } from "./types";

interface NewAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newAccount: NewAccount;
  onAccountChange: (account: NewAccount) => void;
  onAddAccount: () => void;
  loading: boolean;
  onOpenDialog: () => void;
}

export function NewAccountDialog({
  isOpen,
  onOpenChange,
  newAccount,
  onAccountChange,
  onAddAccount,
  loading,
  onOpenDialog,
}: NewAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={onOpenDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hesap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] data-[state=open]:bg-background">
        <style jsx global>{`
          [data-radix-popper-content-wrapper] {
            z-index: 1000;
          }
          .fixed.inset-0 {
            background: rgba(0, 0, 0, 0.3) !important;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Yeni Banka Hesabı Ekle
          </DialogTitle>
          <DialogDescription>
            Yeni bir banka hesabı eklemek için aşağıdaki bilgileri doldurun. Tüm
            alanlar zorunludur.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Banka Adı *</Label>
            <Input
              id="bankName"
              value={newAccount.bankName}
              onChange={(e) =>
                onAccountChange({
                  ...newAccount,
                  bankName: e.target.value,
                })
              }
              placeholder="Örn: Türkiye İş Bankası"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Şube *</Label>
            <Input
              id="branch"
              value={newAccount.branch}
              onChange={(e) =>
                onAccountChange({
                  ...newAccount,
                  branch: e.target.value,
                })
              }
              placeholder="Örn: Kadıköy Şubesi"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN *</Label>
            <Input
              id="iban"
              value={newAccount.iban}
              onChange={(e) =>
                onAccountChange({ ...newAccount, iban: e.target.value })
              }
              placeholder="TR64 0006 4000 0011 2345 6789 01"
              maxLength={32}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Hesap Numarası *</Label>
            <Input
              id="accountNumber"
              value={newAccount.accountNumber}
              onChange={(e) =>
                onAccountChange({
                  ...newAccount,
                  accountNumber: e.target.value,
                })
              }
              placeholder="1234567890"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2"
            >
              İptal
            </Button>
            <Button
              onClick={onAddAccount}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
              disabled={
                loading ||
                !newAccount.bankName ||
                !newAccount.branch ||
                !newAccount.iban ||
                !newAccount.accountNumber
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {loading ? "Ekleniyor..." : "Hesap Ekle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
