import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api";
import { requireManager, AuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const QueryParamsSchema = z.object({
  bankAccountId: z.string().nullable().optional(),
  type: z
    .enum(["HAVALE", "EFT", "VIRMAN", "TAHSILAT", "ODEME", "DIGER"])
    .nullable()
    .optional(),
  startDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      { message: "Geçerli bir başlangıç tarihi girin" }
    ),
  endDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      { message: "Geçerli bir bitiş tarihi girin" }
    ),
  page: z
    .string()
    .nullable()
    .optional()
    .transform((val) => parseInt(val || "1"))
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .nullable()
    .optional()
    .transform((val) => parseInt(val || "10"))
    .pipe(z.number().min(1).max(100)),
});

const BankTransactionCreateSchema = z.object({
  type: z
    .enum(["HAVALE", "EFT", "VIRMAN", "TAHSILAT", "ODEME", "DIGER"])
    .refine(() => true, {
      message: "Geçerli bir işlem türü seçin",
    }),
  amount: z.number().positive("Tutar 0'dan büyük olmalıdır"),
  currency: z.string().optional().default("TL"),
  description: z.string().optional(),
  bankAccountId: z.string().min(1, "Banka hesabı ID zorunludur"),
  targetIban: z.string().optional(),
  targetAccountName: z.string().optional(),
  targetBankName: z.string().optional(),
  referenceNumber: z.string().optional(),
});

const BankTransactionApproveSchema = z.object({
  transactionId: z.string().min(1, "İşlem ID zorunludur"),
  action: z.literal("approve").refine(() => true, {
    message: "Geçerli bir aksiyon seçin (approve)",
  }),
});

type BankTransactionCreateInput = z.infer<typeof BankTransactionCreateSchema>;
type BankTransactionApproveInput = z.infer<typeof BankTransactionApproveSchema>;

// GET - Banka işlemlerini listele
export async function GET(request: NextRequest) {
  return requireManager(async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(req.url);

      // Query parametrelerini validate et
      const queryResult = QueryParamsSchema.safeParse({
        bankAccountId: searchParams.get("bankAccountId"),
        type: searchParams.get("type"),
        startDate: searchParams.get("startDate"),
        endDate: searchParams.get("endDate"),
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
      });

      if (!queryResult.success) {
        return errorResponse(
          `Geçersiz query parametreleri: ${queryResult.error.issues
            .map((e) => e.message)
            .join(", ")}`,
          400
        );
      }

      const { bankAccountId, type, startDate, endDate, page, limit } =
        queryResult.data;

      const where: any = {};
      if (bankAccountId) where.bankAccountId = bankAccountId;
      if (type) where.type = type;
      if (startDate || endDate) {
        where.transactionDate = {};
        if (startDate) where.transactionDate.gte = new Date(startDate);
        if (endDate) where.transactionDate.lte = new Date(endDate);
      }

      const total = await prisma.bankTransaction.count({ where });

      const transactions = await prisma.bankTransaction.findMany({
        where,
        include: {
          bankAccount: {
            select: {
              id: true,
              bankName: true,
              iban: true,
              currency: true,
            },
          },
          createdByUser: {
            select: { id: true, name: true, email: true },
          },
          approvedByUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { transactionDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return successResponse(
        {
          transactions,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Banka işlemleri listelendi"
      );
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(error.message);
      }
      return errorResponse("Internal server error", 500);
    }
  })(request);
}

// POST - Yeni banka işlemi oluştur
export async function POST(request: NextRequest) {
  return requireManager(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();

      const validationResult = BankTransactionCreateSchema.safeParse(body);

      if (!validationResult.success) {
        return errorResponse(
          `Geçersiz veri: ${validationResult.error.issues
            .map((e) => e.message)
            .join(", ")}`,
          400
        );
      }

      const {
        type,
        amount,
        currency,
        description,
        bankAccountId,
        targetIban,
        targetAccountName,
        targetBankName,
        referenceNumber,
      } = validationResult.data;

      const createdBy = req.user?.userId;
      if (!createdBy) {
        return errorResponse("Kullanıcı doğrulanamadı", 401);
      }

      const bankAccount = await prisma.bankAccount.findUnique({
        where: { id: bankAccountId },
      });

      if (!bankAccount) {
        return errorResponse("Geçerli bir banka hesabı seçin");
      }

      if (!bankAccount.isActive) {
        return errorResponse("Seçilen banka hesabı aktif değil");
      }

      const transaction = await prisma.bankTransaction.create({
        data: {
          type,
          amount,
          currency,
          description,
          bankAccountId,
          targetIban,
          targetAccountName,
          targetBankName,
          referenceNumber,
          createdBy,
        },
        include: {
          bankAccount: {
            select: {
              id: true,
              bankName: true,
              iban: true,
              currency: true,
            },
          },
          createdByUser: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return successResponse(transaction, "Banka işlemi başarıyla oluşturuldu");
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(error.message);
      }
      return errorResponse("Internal server error", 500);
    }
  })(request);
}

// PUT - Banka işlemini onayla
export async function PUT(request: NextRequest) {
  return requireManager(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();

      const validationResult = BankTransactionApproveSchema.safeParse(body);

      if (!validationResult.success) {
        return errorResponse(
          `Geçersiz veri: ${validationResult.error.issues
            .map((e) => e.message)
            .join(", ")}`,
          400
        );
      }

      const { transactionId, action } = validationResult.data;

      const approvedBy = req.user?.userId;
      if (!approvedBy) {
        return errorResponse("Kullanıcı doğrulanamadı", 401);
      }

      const existingTransaction = await prisma.bankTransaction.findUnique({
        where: { id: transactionId },
      });

      if (!existingTransaction) {
        return errorResponse("İşlem bulunamadı");
      }

      if (existingTransaction.approvedBy) {
        return errorResponse("İşlem zaten onaylanmış");
      }

      const transaction = await prisma.bankTransaction.update({
        where: { id: transactionId },
        data: {
          approvedBy,
          approvedAt: new Date(),
        },
        include: {
          bankAccount: {
            select: {
              id: true,
              bankName: true,
              iban: true,
              currency: true,
            },
          },
          createdByUser: {
            select: { id: true, name: true, email: true },
          },
          approvedByUser: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return successResponse(transaction, "Banka işlemi başarıyla onaylandı");
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(error.message);
      }
      return errorResponse("Internal server error", 500);
    }
  })(request);
}
