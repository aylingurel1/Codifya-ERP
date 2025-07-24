"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BankAccount } from "./types";

interface EditAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAccount: BankAccount | null;
  onAccountChange: (account: BankAccount) => void;
  onUpdateAccount: () => void;
  loading: boolean;
}

export function EditAccountDialog({
  isOpen,
  onOpenChange,
  editingAccount,
  onAccountChange,
  onUpdateAccount,
  loading,
}: EditAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hesabı Düzenle</DialogTitle>
          <DialogDescription>
            Banka hesabı bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>
        {editingAccount && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editBankName">Banka Adı *</Label>
              <Input
                id="editBankName"
                value={editingAccount.bankName}
                onChange={(e) =>
                  onAccountChange({
                    ...editingAccount,
                    bankName: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBranch">Şube *</Label>
              <Input
                id="editBranch"
                value={editingAccount.branch}
                onChange={(e) =>
                  onAccountChange({
                    ...editingAccount,
                    branch: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIban">IBAN *</Label>
              <Input
                id="editIban"
                value={editingAccount.iban}
                onChange={(e) =>
                  onAccountChange({
                    ...editingAccount,
                    iban: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAccountNumber">Hesap Numarası *</Label>
              <Input
                id="editAccountNumber"
                value={editingAccount.accountNumber}
                onChange={(e) =>
                  onAccountChange({
                    ...editingAccount,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={onUpdateAccount} disabled={loading}>
            {loading ? "Güncelleniyor..." : "Kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
