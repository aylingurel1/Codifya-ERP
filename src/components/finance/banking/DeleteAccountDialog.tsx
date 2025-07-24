"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BankAccount } from "./types";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountToDelete: BankAccount | null;
  onDeleteAccount: () => void;
  loading: boolean;
}

export function DeleteAccountDialog({
  isOpen,
  onOpenChange,
  accountToDelete,
  onDeleteAccount,
  loading,
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hesabı Silmek İstediğinize Emin misiniz?</DialogTitle>
          <DialogDescription>
            "{accountToDelete?.bankName} - {accountToDelete?.iban}" hesabını
            sileceksiniz. Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={onDeleteAccount} disabled={loading}>
            {loading ? "Siliniyor..." : "Evet, Sil"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
