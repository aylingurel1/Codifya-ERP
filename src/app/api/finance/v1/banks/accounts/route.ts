import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api";
// import { requireManager, AuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BankAccountCreateSchema = z.object({
  bankName: z
    .string()
    .min(1, "Banka adı zorunludur")
    .max(100, "Banka adı çok uzun"),
  branch: z
    .string()
    .min(1, "Şube adı zorunludur")
    .max(100, "Şube adı çok uzun"),
  iban: z
    .string()
    .min(26, "IBAN 26 karakter olmalıdır")
    .max(26, "IBAN 26 karakter olmalıdır")
    .regex(
      /^TR\d{24}$/,
      "Geçerli bir Türk IBAN numarası girin (TR ile başlamalı ve 26 karakter olmalı)"
    ),
  accountNumber: z
    .string()
    .min(1, "Hesap numarası zorunludur")
    .max(50, "Hesap numarası çok uzun"),
  currency: z.string().optional().default("TRY"),
  balance: z.number().min(0, "Bakiye negatif olamaz").optional().default(0),
});

const QueryParamsSchema = z.object({
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
    .transform((val) => parseInt(val || "20"))
    .pipe(z.number().min(1).max(100)),
  search: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  isActive: z
    .string()
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === undefined ? true : val === "true"
    ),
});

type BankAccountCreateInput = z.infer<typeof BankAccountCreateSchema>;

// GET - Banka hesaplarını listele
export async function GET(request: NextRequest) {
  // Authorization geçici olarak devre dışı
  // return requireManager(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    // Query parametrelerini validate et
    const queryResult = QueryParamsSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      bankName: searchParams.get("bankName"),
      isActive: searchParams.get("isActive"),
    });

    if (!queryResult.success) {
      return errorResponse(
        `Geçersiz query parametreleri: ${queryResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { page, limit, search, bankName, isActive } = queryResult.data;

    const where: any = { isActive };
    if (search && search.trim() !== "") {
      where.OR = [
        { bankName: { contains: search, mode: "insensitive" } },
        { iban: { contains: search, mode: "insensitive" } },
        { accountNumber: { contains: search, mode: "insensitive" } },
        { branch: { contains: search, mode: "insensitive" } },
      ];
    }
    if (bankName && bankName.trim() !== "")
      where.bankName = { contains: bankName, mode: "insensitive" };

    const total = await prisma.bankAccount.count({ where });

    const accounts = await prisma.bankAccount.findMany({
      where,
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(
      {
        data: accounts,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Banka hesapları listelendi"
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
  // })(request);
}

// POST - Yeni banka hesabı oluştur
export async function POST(request: NextRequest) {
  // Authorization geçici olarak devre dışı
  // return requireManager(async (req: AuthenticatedRequest) => {
  try {
    const body = await request.json();

    const validationResult = BankAccountCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(
        `Geçersiz veri: ${validationResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { bankName, branch, iban, accountNumber, currency, balance } =
      validationResult.data;

    // Authorization geçici olarak devre dışı
    // const createdBy = req.user?.userId;
    const createdBy = "cmcbrx0to0000va2bfvgwoywk"; // Gerçek user ID
    // if (!createdBy) {
    //   return errorResponse("Kullanıcı doğrulanamadı", 401);
    // }

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { iban },
    });

    if (existingAccount) {
      return errorResponse(
        "Bu IBAN numarası ile başka bir hesap zaten mevcut",
        409
      );
    }

    const newAccount = await prisma.bankAccount.create({
      data: {
        bankName,
        branch,
        iban,
        accountNumber,
        currency,
        balance,
        createdBy,
      },
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(newAccount, "Banka hesabı başarıyla oluşturuldu");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
  // })(request);
}
