"use client";

import { useState } from "react";
import { BankAccountCard } from "./BankAccountCard";
import { NewAccountDialog } from "./NewAccountDialog";
import { EditAccountDialog } from "./EditAccountDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { useBankingData } from "./useBankingData";
import type { BankAccount, NewAccount } from "./types";

export function BankAccountsTab() {
  const {
    accounts,
    loading,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
  } = useBankingData();

  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null
  );

  const [newAccount, setNewAccount] = useState<NewAccount>({
    bankName: "",
    branch: "",
    iban: "",
    accountNumber: "",
  });

  // Dialog state'leri
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Account handlers
  const resetNewAccountForm = () => {
    setNewAccount({
      bankName: "",
      branch: "",
      iban: "",
      accountNumber: "",
    });
  };

  const handleOpenNewAccountDialog = () => {
    resetNewAccountForm();
    setIsNewAccountOpen(true);
  };

  const handleAddAccount = async () => {
    if (
      !newAccount.bankName.trim() ||
      !newAccount.branch.trim() ||
      !newAccount.iban.trim() ||
      !newAccount.accountNumber.trim()
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (!newAccount.iban.startsWith("TR") || newAccount.iban.length < 26) {
      alert("Lütfen geçerli bir IBAN giriniz.");
      return;
    }

    const accountData = {
      bankName: newAccount.bankName.trim(),
      branch: newAccount.branch.trim(),
      iban: newAccount.iban.trim().toUpperCase(),
      accountNumber: newAccount.accountNumber.trim(),
      balance: 0,
    };

    const result = await addBankAccount(accountData);

    if (result.success) {
      setIsNewAccountOpen(false);
      resetNewAccountForm();
      alert("Banka hesabı başarıyla eklendi!");
    } else {
      alert(`Hata: ${result.error}`);
    }
  };

  const handleOpenEditDialog = (account: BankAccount) => {
    setEditingAccount(account);
    setIsEditAccountOpen(true);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;

    const result = await updateBankAccount(editingAccount);

    if (result.success) {
      alert("Hesap başarıyla güncellendi.");
      setIsEditAccountOpen(false);
      setEditingAccount(null);
    } else {
      alert(result.error);
    }
  };

  const handleOpenDeleteDialog = (account: BankAccount) => {
    setAccountToDelete(account);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    const result = await deleteBankAccount(accountToDelete.id);

    if (result.success) {
      alert("Hesap başarıyla silindi.");
      setIsDeleteConfirmOpen(false);
      setAccountToDelete(null);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Banka Hesapları
        </h2>
        <NewAccountDialog
          isOpen={isNewAccountOpen}
          onOpenChange={setIsNewAccountOpen}
          newAccount={newAccount}
          onAccountChange={setNewAccount}
          onAddAccount={handleAddAccount}
          loading={loading}
          onOpenDialog={handleOpenNewAccountDialog}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(accounts) &&
          accounts.map((account) => (
            <BankAccountCard
              key={account.id}
              account={account}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
            />
          ))}
      </div>

      <EditAccountDialog
        isOpen={isEditAccountOpen}
        onOpenChange={setIsEditAccountOpen}
        editingAccount={editingAccount}
        onAccountChange={setEditingAccount}
        onUpdateAccount={handleUpdateAccount}
        loading={loading}
      />

      <DeleteAccountDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        accountToDelete={accountToDelete}
        onDeleteAccount={handleDeleteAccount}
        loading={loading}
      />
    </div>
  );
}
