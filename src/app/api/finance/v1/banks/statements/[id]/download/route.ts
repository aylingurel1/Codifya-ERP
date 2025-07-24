// app/api/finance/v1/banks/statements/[id]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/finance/v1/banks/statements/[id]/download
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const statementId = resolvedParams.id;

    if (!statementId) {
      return NextResponse.json(
        { message: "Statement ID is required" },
        { status: 400 }
      );
    }

    // Ekstreyi veritabanından al
    const statement = await prisma.bankStatement.findUnique({
      where: { id: statementId },
      include: {
        bankAccount: true,
      },
    });

    if (!statement) {
      return NextResponse.json(
        { message: "Statement not found" },
        { status: 404 }
      );
    }

    // İlgili tarih aralığındaki tüm işlemleri al
    const transactions = await prisma.bankTransaction.findMany({
      where: {
        bankAccountId: statement.bankAccountId,
        transactionDate: {
          gte: statement.startDate,
          lte: statement.endDate,
        },
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        transactionDate: "asc",
      },
    });

    // PDF içeriği oluştur (basit metin formatında)
    const content = generateStatementContent(statement, transactions);

    // Dosya adı oluştur - Türkçe karakterleri İngilizce karşılıklarıyla değiştir
    const sanitizeBankName = (name: string) => {
      return name
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "G")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "U")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "S")
        .replace(/ı/g, "i")
        .replace(/İ/g, "I")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "O")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, ""); // Sadece harf, sayı ve _ karakterlerini bırak
    };

    const sanitizedBankName = statement.bankAccount?.bankName
      ? sanitizeBankName(statement.bankAccount.bankName)
      : "banka";

    const fileName = `ekstre_${sanitizedBankName}_${statement.startDate
      .toISOString()
      .slice(0, 7)}.txt`;

    // Response headers ayarla
    const headers = new Headers();
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

    return new NextResponse(content, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error downloading statement:", error);
    return NextResponse.json(
      { message: "Failed to download statement", error },
      { status: 500 }
    );
  }
}

function generateStatementContent(statement: any, transactions: any[]): string {
  const { bankAccount } = statement;

  let content = `
=== BANKA EKSTRESİ ===

Banka: ${bankAccount?.bankName || "Bilinmiyor"}
Şube: ${bankAccount?.branch || "Bilinmiyor"}  
IBAN: ${bankAccount?.iban || "Bilinmiyor"}
Hesap No: ${bankAccount?.accountNumber || "Bilinmiyor"}

Ekstre Dönemi: ${statement.startDate.toLocaleDateString(
    "tr-TR"
  )} - ${statement.endDate.toLocaleDateString("tr-TR")}
Ekstre Tarihi: ${statement.statementDate.toLocaleDateString("tr-TR")}

Dönem Başı Bakiye: ${statement.balanceStart.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  })} TRY
Dönem Sonu Bakiye: ${statement.balanceEnd.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  })} TRY

=== İŞLEMLER ===

`;

  if (transactions.length === 0) {
    content += "Bu dönemde herhangi bir işlem bulunmamaktadır.\n";
  } else {
    content +=
      "Tarih        | Tür       | Açıklama                    | Tutar            | Bakiye\n";
    content +=
      "-------------|-----------|-----------------------------|-----------------|-----------------\n";

    let currentBalance = statement.balanceStart;

    transactions.forEach((transaction) => {
      const date = transaction.transactionDate.toLocaleDateString("tr-TR");
      const type = transaction.type.padEnd(9);
      const description = (transaction.description || "İşlem")
        .substring(0, 25)
        .padEnd(27);

      // İşlem türüne göre bakiyeyi güncelle
      let amount = transaction.amount;
      if (
        transaction.type === "HAVALE" ||
        transaction.type === "EFT" ||
        transaction.type === "ODEME"
      ) {
        currentBalance -= amount;
        amount = -amount;
      } else {
        currentBalance += amount;
      }

      const amountStr = amount
        .toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          signDisplay: amount >= 0 ? "never" : "always",
        })
        .padStart(15);

      const balanceStr = currentBalance
        .toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
        })
        .padStart(15);

      content += `${date} | ${type} | ${description} | ${amountStr} TRY | ${balanceStr} TRY\n`;
    });
  }

  content += `
=== ÖZET ===
Toplam İşlem Sayısı: ${transactions.length}
Dönem Başı Bakiye: ${statement.balanceStart.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  })} TRY
Dönem Sonu Bakiye: ${statement.balanceEnd.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  })} TRY
Net Değişim: ${(statement.balanceEnd - statement.balanceStart).toLocaleString(
    "tr-TR",
    { minimumFractionDigits: 2 }
  )} TRY

Bu ekstre ${new Date().toLocaleDateString(
    "tr-TR"
  )} tarihinde otomatik olarak oluşturulmuştur.
`;

  return content;
}
