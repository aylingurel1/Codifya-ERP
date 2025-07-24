"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Download,
  Edit,
  Trash2,
  Plus,
  FileText,
} from "lucide-react";
import { useBankingData } from "./useBankingData";
import type { BankAccount, BankStatement, StatementFilters } from "./types";

// Date formatting utility
const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "";

    // Format as yyyy-MM-dd for HTML date input
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

export function BankStatements() {
  const {
    accounts,
    statements,
    loading,
    error,
    fetchBankAccounts,
    fetchBankStatements,
    createBankStatement,
    updateBankStatement,
    deleteBankStatement,
    downloadStatement,
  } = useBankingData();

  const [filters, setFilters] = useState<StatementFilters>({
    selectedAccount: "",
    startDate: undefined,
    endDate: undefined,
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] =
    useState<BankStatement | null>(null);

  const [newStatement, setNewStatement] = useState({
    bankAccountId: "",
    statementDate: "",
    startDate: "",
    endDate: "",
    balanceStart: 0,
    balanceEnd: 0,
  });

  const [editStatement, setEditStatement] = useState({
    statementDate: "",
    startDate: "",
    endDate: "",
    balanceStart: 0,
    balanceEnd: 0,
  });

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  useEffect(() => {
    if (filters.selectedAccount) {
      fetchBankStatements(
        filters.selectedAccount,
        filters.startDate,
        filters.endDate
      );
    }
  }, [filters]);

  const handleCreateStatement = async () => {
    if (
      !newStatement.bankAccountId ||
      !newStatement.statementDate ||
      !newStatement.startDate ||
      !newStatement.endDate
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    const result = await createBankStatement({
      bankAccountId: newStatement.bankAccountId,
      statementDate: new Date(newStatement.statementDate),
      startDate: new Date(newStatement.startDate),
      endDate: new Date(newStatement.endDate),
      balanceStart: newStatement.balanceStart,
      balanceEnd: newStatement.balanceEnd,
    });

    if (result.success) {
      setIsCreateDialogOpen(false);
      setNewStatement({
        bankAccountId: "",
        statementDate: "",
        startDate: "",
        endDate: "",
        balanceStart: 0,
        balanceEnd: 0,
      });
      // Refresh statements
      if (filters.selectedAccount) {
        fetchBankStatements(
          filters.selectedAccount,
          filters.startDate,
          filters.endDate
        );
      }
    } else {
      alert(result.error);
    }
  };

  const handleEditStatement = async () => {
    if (!selectedStatement) return;

    const result = await updateBankStatement(selectedStatement.id, {
      statementDate: editStatement.statementDate
        ? new Date(editStatement.statementDate)
        : undefined,
      startDate: editStatement.startDate
        ? new Date(editStatement.startDate)
        : undefined,
      endDate: editStatement.endDate
        ? new Date(editStatement.endDate)
        : undefined,
      balanceStart: editStatement.balanceStart,
      balanceEnd: editStatement.balanceEnd,
    });

    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedStatement(null);
      // Refresh statements
      if (filters.selectedAccount) {
        fetchBankStatements(
          filters.selectedAccount,
          filters.startDate,
          filters.endDate
        );
      }
    } else {
      alert(result.error);
    }
  };

  const handleDeleteStatement = async (statementId: string) => {
    if (!confirm("Bu ekstreyi silmek istediğinizden emin misiniz?")) return;

    const result = await deleteBankStatement(statementId);
    if (result.success) {
      // Refresh statements
      if (filters.selectedAccount) {
        fetchBankStatements(
          filters.selectedAccount,
          filters.startDate,
          filters.endDate
        );
      }
    } else {
      alert(result.error);
    }
  };

  const handleDownloadStatement = async (statementId: string) => {
    const result = await downloadStatement(statementId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const openEditDialog = (statement: BankStatement) => {
    setSelectedStatement(statement);
    setEditStatement({
      statementDate: statement.statementDate.toISOString().split("T")[0],
      startDate: statement.startDate.toISOString().split("T")[0],
      endDate: statement.endDate.toISOString().split("T")[0],
      balanceStart: statement.balanceStart,
      balanceEnd: statement.balanceEnd,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banka Ekstreleri</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ekstre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Banka Ekstresi</DialogTitle>
              <DialogDescription>
                Yeni bir banka ekstresi oluşturun.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="account">Banka Hesabı</Label>
                <Select
                  value={newStatement.bankAccountId}
                  onValueChange={(value) =>
                    setNewStatement({ ...newStatement, bankAccountId: value })
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
              <div className="grid gap-2">
                <Label htmlFor="statementDate">Ekstre Tarihi</Label>
                <Input
                  id="statementDate"
                  type="date"
                  value={formatDateForInput(newStatement.statementDate)}
                  onChange={(e) =>
                    setNewStatement({
                      ...newStatement,
                      statementDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formatDateForInput(newStatement.startDate)}
                    onChange={(e) =>
                      setNewStatement({
                        ...newStatement,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formatDateForInput(newStatement.endDate)}
                    onChange={(e) =>
                      setNewStatement({
                        ...newStatement,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="balanceStart">Dönem Başı Bakiye</Label>
                  <Input
                    id="balanceStart"
                    type="number"
                    step="0.01"
                    value={newStatement.balanceStart}
                    onChange={(e) =>
                      setNewStatement({
                        ...newStatement,
                        balanceStart: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="balanceEnd">Dönem Sonu Bakiye</Label>
                  <Input
                    id="balanceEnd"
                    type="number"
                    step="0.01"
                    value={newStatement.balanceEnd}
                    onChange={(e) =>
                      setNewStatement({
                        ...newStatement,
                        balanceEnd: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                İptal
              </Button>
              <Button onClick={handleCreateStatement} disabled={loading}>
                {loading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Banka Hesabı</Label>
              <Select
                value={filters.selectedAccount}
                onValueChange={(value) =>
                  setFilters({ ...filters, selectedAccount: value })
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
            <div className="grid gap-2">
              <Label>Başlangıç Tarihi</Label>
              <Input
                type="date"
                value={formatDateForInput(filters.startDate)}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Bitiş Tarihi</Label>
              <Input
                type="date"
                value={formatDateForInput(filters.endDate)}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    endDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Banka Ekstreleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : statements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filters.selectedAccount
                ? "Bu hesap için ekstre bulunamadı"
                : "Ekstre görüntülemek için bir hesap seçin"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Banka</TableHead>
                    <TableHead className="min-w-[120px]">
                      Ekstre Tarihi
                    </TableHead>
                    <TableHead className="min-w-[150px]">Dönem</TableHead>
                    <TableHead className="min-w-[130px]">
                      Başlangıç Bakiye
                    </TableHead>
                    <TableHead className="min-w-[130px]">
                      Bitiş Bakiye
                    </TableHead>
                    <TableHead className="min-w-[120px]">Oluşturulma</TableHead>
                    <TableHead className="min-w-[150px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statements.map((statement) => (
                    <TableRow key={statement.id}>
                      <TableCell className="max-w-[200px]">
                        <div>
                          <div
                            className="font-medium truncate"
                            title={
                              statement.bankAccount?.bankName || "Bilinmiyor"
                            }
                          >
                            {statement.bankAccount?.bankName || "Bilinmiyor"}
                          </div>
                          <div
                            className="text-sm text-gray-500 truncate font-mono"
                            title={statement.bankAccount?.iban || ""}
                          >
                            {statement.bankAccount?.iban || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {statement.statementDate.toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">
                          {statement.startDate.toLocaleDateString("tr-TR")} -{" "}
                          {statement.endDate.toLocaleDateString("tr-TR")}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary">
                          ₺
                          {statement.balanceStart.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary">
                          ₺
                          {statement.balanceEnd.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownloadStatement(statement.id)
                            }
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(statement)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStatement(statement.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ekstreyi Düzenle</DialogTitle>
            <DialogDescription>
              Ekstre bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editStatementDate">Ekstre Tarihi</Label>
              <Input
                id="editStatementDate"
                type="date"
                value={formatDateForInput(editStatement.statementDate)}
                onChange={(e) =>
                  setEditStatement({
                    ...editStatement,
                    statementDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editStartDate">Başlangıç Tarihi</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={formatDateForInput(editStatement.startDate)}
                  onChange={(e) =>
                    setEditStatement({
                      ...editStatement,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEndDate">Bitiş Tarihi</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={formatDateForInput(editStatement.endDate)}
                  onChange={(e) =>
                    setEditStatement({
                      ...editStatement,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editBalanceStart">Dönem Başı Bakiye</Label>
                <Input
                  id="editBalanceStart"
                  type="number"
                  step="0.01"
                  value={editStatement.balanceStart}
                  onChange={(e) =>
                    setEditStatement({
                      ...editStatement,
                      balanceStart: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBalanceEnd">Dönem Sonu Bakiye</Label>
                <Input
                  id="editBalanceEnd"
                  type="number"
                  step="0.01"
                  value={editStatement.balanceEnd}
                  onChange={(e) =>
                    setEditStatement({
                      ...editStatement,
                      balanceEnd: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              İptal
            </Button>
            <Button onClick={handleEditStatement} disabled={loading}>
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
