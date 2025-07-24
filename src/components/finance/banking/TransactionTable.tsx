"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Transaction } from "./types";

interface TransactionTableProps {
  transactions: Transaction[];
  onApproveTransaction: (transactionId: string) => void;
  loading: boolean;
}

export function TransactionTable({
  transactions,
  onApproveTransaction,
  loading,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Tarih</TableHead>
            <TableHead className="min-w-[80px]">Tür</TableHead>
            <TableHead className="min-w-[200px]">Banka Hesabı</TableHead>
            <TableHead className="min-w-[150px]">Alıcı IBAN</TableHead>
            <TableHead className="min-w-[100px]">Tutar</TableHead>
            <TableHead className="min-w-[80px]">Durum</TableHead>
            <TableHead className="min-w-[100px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <span>Seçili tarih aralığında işlem bulunamadı</span>
                  <span className="text-sm">
                    Farklı bir tarih aralığı deneyin veya filtreleri değiştirin
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {format(
                    new Date(transaction.transactionDate),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: tr,
                    }
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "HAVALE" ||
                      transaction.type === "EFT"
                        ? "default"
                        : "secondary"
                    }
                    className="whitespace-nowrap"
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[200px]">
                  <div
                    className="truncate"
                    title={`${transaction.bankAccount?.bankName} - ${transaction.bankAccount?.iban}`}
                  >
                    {transaction.bankAccount?.bankName} -{" "}
                    {transaction.bankAccount?.iban}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[150px]">
                  <div
                    className="truncate"
                    title={transaction.targetIban || "N/A"}
                  >
                    {transaction.targetIban || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.approvedBy ? "default" : "secondary"}
                    className="whitespace-nowrap"
                  >
                    {transaction.approvedBy ? "Onaylandı" : "Bekliyor"}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {!transaction.approvedBy && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApproveTransaction(transaction.id)}
                      disabled={loading}
                    >
                      Onayla
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
