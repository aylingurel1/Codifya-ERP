import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  createPaginationMeta,
} from "@/utils/api";
import { requireManager, AuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Basit ve benzersiz referans numarası oluşturucu
const generateReferenceNumber = async (): Promise<string> => {
  const timestamp = Date.now().toString().slice(-8); // Son 8 hane
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  const referenceNumber = `BT${timestamp}${random}`;

  // Eğer aynı numara varsa yeni bir tane oluştur (çok nadir durum)
  const exists = await prisma.bankTransaction.findUnique({
    where: { referenceNumber },
  });

  if (exists) {
    // Tekrar dene (recursive call, ama çok nadir)
    return generateReferenceNumber();
  }

  return referenceNumber;
};

// Şemalar daha basit ve okunaklı hale getirildi.
const QueryParamsSchema = z.object({
  bankAccountId: z.string().optional(),
  type: z
    .enum(["HAVALE", "EFT", "VIRMAN", "TAHSILAT", "ODEME", "DIGER"])
    .optional(),
  startDate: z.coerce
    .date({ message: "Geçerli bir başlangıç tarihi girin" })
    .optional(),
  endDate: z.coerce
    .date({ message: "Geçerli bir bitiş tarihi girin" })
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const BankTransactionCreateSchema = z.object({
  type: z.enum(["HAVALE", "EFT", "VIRMAN", "TAHSILAT", "ODEME", "DIGER"], {
    required_error: "Geçerli bir işlem türü seçin",
  }),
  // DEĞİŞTİ: z.coerce.number() kullanımı hem string hem number gelen değerleri
  // otomatik olarak sayıya çevirir ve daha basittir.
  amount: z.coerce.number().positive("Tutar 0'dan büyük olmalıdır"),
  currency: z.string().optional().default("TRY"),
  description: z.string().optional(),
  bankAccountId: z.string().min(1, "Banka hesabı ID zorunludur"),
  targetIban: z.string().optional(),
  targetAccountName: z.string().optional(),
  targetBankName: z.string().optional(),
  referenceNumber: z.string().optional(),
});

const BankTransactionApproveSchema = z.object({
  transactionId: z.string().min(1, "İşlem ID zorunludur"),
  action: z.literal("approve", {
    errorMap: () => ({ message: "Geçerli bir aksiyon seçin (approve)" }),
  }),
});

// GET - Banka işlemlerini listele
export async function GET(request: NextRequest) {
  try {
    const queryParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const validation = QueryParamsSchema.safeParse(queryParams);

    if (!validation.success) {
      return errorResponse(
        `Geçersiz parametreler: ${validation.error.flatten().fieldErrors}`,
        400
      );
    }

    const { bankAccountId, type, startDate, endDate, page, limit } =
      validation.data;

    const where = {
      bankAccountId,
      type,
      transactionDate: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    };

    const [total, transactions] = await prisma.$transaction([
      prisma.bankTransaction.count({ where }),
      prisma.bankTransaction.findMany({
        where,
        include: {
          bankAccount: {
            select: { id: true, bankName: true, iban: true, currency: true },
          },
          createdByUser: { select: { id: true, name: true, email: true } },
          approvedByUser: { select: { id: true, name: true, email: true } },
        },
        orderBy: { transactionDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return successResponse(
      { transactions },
      "Banka işlemleri listelendi",
      createPaginationMeta(page, limit, total)
    );
  } catch (error) {
    console.error("GET /transactions error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    );
  }
}

// POST - Yeni banka işlemi oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));

    const validation = BankTransactionCreateSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation errors:", validation.error.flatten().fieldErrors);
      console.log("Raw validation error:", validation.error.issues);
      return errorResponse(
        `Validasyon hatası: ${JSON.stringify(
          validation.error.flatten().fieldErrors,
          null,
          2
        )}`,
        400
      );
    }

    const { bankAccountId, ...transactionData } = validation.data;

    // Test için geçici olarak sabit kullanıcı ID'si
    const createdBy = "cmcbrx0to0000va2bfvgwoywk";

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
    });

    if (!bankAccount) {
      return errorResponse("Geçerli bir banka hesabı seçin", 404);
    }
    if (!bankAccount.isActive) {
      return errorResponse("Seçilen banka hesabı aktif değil", 400);
    }

    // Generate unique reference number if not provided
    const referenceNumber =
      transactionData.referenceNumber || (await generateReferenceNumber());

    const transaction = await prisma.bankTransaction.create({
      data: {
        ...transactionData,
        referenceNumber,
        bankAccountId,
        createdBy,
      },
      include: {
        bankAccount: {
          select: { id: true, bankName: true, iban: true, currency: true },
        },
        createdByUser: { select: { id: true, name: true, email: true } },
        approvedByUser: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse(
      transaction,
      "Banka işlemi başarıyla oluşturuldu",
      undefined,
      201
    );
  } catch (error) {
    console.error("POST /transactions error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    );
  }
}

// PUT - Banka işlemini onayla
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = BankTransactionApproveSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        `Geçersiz veri: ${JSON.stringify(
          validation.error.flatten().fieldErrors
        )}`,
        400
      );
    }

    const { transactionId } = validation.data;
    // Test için geçici olarak sabit kullanıcı ID'si
    const approvedBy = "cmcbrx0to0000va2bfvgwoywk";

    const existingTransaction = await prisma.bankTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      return errorResponse("İşlem bulunamadı", 404);
    }
    if (existingTransaction.approvedBy) {
      return errorResponse("İşlem zaten onaylanmış", 409); // 409 Conflict daha uygun
    }

    const transaction = await prisma.bankTransaction.update({
      where: { id: transactionId },
      data: {
        approvedBy,
        approvedAt: new Date(),
      },
      include: {
        bankAccount: {
          select: { id: true, bankName: true, iban: true, currency: true },
        },
        createdByUser: { select: { id: true, name: true, email: true } },
        approvedByUser: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse(transaction, "Banka işlemi başarıyla onaylandı");
  } catch (error) {
    console.error("PUT /transactions error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"
    );
  }
}
