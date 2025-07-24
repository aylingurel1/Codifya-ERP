"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BankAccount } from "./types";

interface BankAccountCardProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (account: BankAccount) => void;
}

export function BankAccountCard({
  account,
  onEdit,
  onDelete,
}: BankAccountCardProps) {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-lg flex flex-col justify-between">
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Building2 className="h-5 w-5 text-gray-500" />
            {account.bankName}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {account.branch}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">IBAN</p>
            <p className="font-mono text-sm text-gray-900">{account.iban}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Hesap No</p>
            <p className="font-mono text-sm text-gray-900">
              {account.accountNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Bakiye</p>
            <p className="text-lg font-semibold text-gray-900">
              {account.balance.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </CardContent>
      </div>
      <div className="flex justify-end gap-2 p-4 border-t">
        <Button variant="outline" size="sm" onClick={() => onEdit(account)}>
          <Pencil className="h-4 w-4 mr-1" /> Düzenle
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(account)}>
          <Trash2 className="h-4 w-4 mr-1" /> Sil
        </Button>
      </div>
    </Card>
  );
}
