import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api";
// import { requireManager, AuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ParamsSchema = z.object({
  id: z.string().min(1, "Hesap ID zorunludur"),
});

const BankAccountUpdateSchema = z.object({
  bankName: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
      message: "Banka adı boş olamaz",
    })
    .refine((val) => val === undefined || val.length <= 100, {
      message: "Banka adı çok uzun",
    }),
  branch: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
      message: "Şube adı boş olamaz",
    })
    .refine((val) => val === undefined || val.length <= 100, {
      message: "Şube adı çok uzun",
    }),
  accountNumber: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
      message: "Hesap numarası boş olamaz",
    })
    .refine((val) => val === undefined || val.length <= 50, {
      message: "Hesap numarası çok uzun",
    }),
  currency: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
      message: "Para birimi boş olamaz",
    })
    .refine((val) => val === undefined || val.length <= 10, {
      message: "Para birimi çok uzun",
    }),
  balance: z.number().min(0, "Bakiye negatif olamaz").optional(),
});

type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;

// GET - Belirli bir banka hesabının detayını getir
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Authorization geçici olarak devre dışı
  // return requireManager(async (req: AuthenticatedRequest) => {
  try {
    const params = await context.params;
    const paramsResult = ParamsSchema.safeParse(params);

    if (!paramsResult.success) {
      return errorResponse(
        `Geçersiz parametreler: ${paramsResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { id } = paramsResult.data;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) {
      return errorResponse("Banka hesabı bulunamadı", 404);
    }

    return successResponse(account, "Banka hesabı detayı getirildi");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
  // })(request);
}

// PUT - Banka hesabını güncelle
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Authorization geçici olarak devre dışı
  // return requireManager(async (req: AuthenticatedRequest) => {
  try {
    // Params'ı await et ve validate et
    const params = await context.params;
    const paramsResult = ParamsSchema.safeParse(params);

    if (!paramsResult.success) {
      return errorResponse(
        `Geçersiz parametreler: ${paramsResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { id } = paramsResult.data;

    const body = await request.json();

    const validationResult = BankAccountUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(
        `Geçersiz veri: ${validationResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { bankName, branch, accountNumber, currency, balance } =
      validationResult.data;

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      return errorResponse("Banka hesabı bulunamadı", 404);
    }

    const updateData: any = {};
    if (bankName !== undefined) updateData.bankName = bankName;
    if (branch !== undefined) updateData.branch = branch;
    if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
    if (currency !== undefined) updateData.currency = currency;
    if (balance !== undefined) updateData.balance = balance;

    updateData.updatedAt = new Date();

    const updatedAccount = await prisma.bankAccount.update({
      where: { id },
      data: updateData,
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(
      updatedAccount,
      "Banka hesabı başarıyla güncellendi"
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
  // })(request);
}

// DELETE - Banka hesabını sil (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Authorization geçici olarak devre dışı
  // return requireManager(async (req: AuthenticatedRequest) => {
  try {
    // Params'ı await et ve validate et
    const params = await context.params;
    const paramsResult = ParamsSchema.safeParse(params);

    if (!paramsResult.success) {
      return errorResponse(
        `Geçersiz parametreler: ${paramsResult.error.issues
          .map((e: any) => e.message)
          .join(", ")}`,
        400
      );
    }

    const { id } = paramsResult.data;

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!existingAccount) {
      return errorResponse("Banka hesabı bulunamadı", 404);
    }

    if (existingAccount._count.transactions > 0) {
      return errorResponse(
        "Bu hesapta işlemler bulunduğu için silinemez. Önce hesabı pasif hale getirebilirsiniz.",
        400
      );
    }

    // Soft delete (hesabı pasif hale getir)
    const deletedAccount = await prisma.bankAccount.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return successResponse(
      {
        message: "Banka hesabı başarıyla pasif hale getirildi",
        accountId: deletedAccount.id,
      },
      "Hesap silindi"
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
  // })(request);
}
