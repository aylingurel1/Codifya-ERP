import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api";
import { requireManager, AuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ReportTypeEnum = z.enum(["BALANCE", "TRANSACTION", "RECONCILIATION"]);

const GetQuerySchema = z.object({
  reportType: ReportTypeEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const PostBodySchema = z.object({
  reportName: z.string().min(1, "Rapor adı zorunludur"),
  reportType: ReportTypeEnum,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reportParameters: z.record(z.string(), z.any()).optional(),
});

// GET - Banka raporlarını listele
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      reportType: searchParams.get("reportType") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    };

    const validatedQuery = GetQuerySchema.parse(queryParams);

    
    const where: any = {};
    if (validatedQuery.reportType) where.reportType = validatedQuery.reportType;
    if (validatedQuery.startDate)
      where.startDate = { gte: new Date(validatedQuery.startDate) };
    if (validatedQuery.endDate)
      where.endDate = { lte: new Date(validatedQuery.endDate) };

    const total = await prisma.bankReporting.count({ where });

    const reports = await prisma.bankReporting.findMany({
      where,
      include: {
        generatedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { generatedDate: "desc" },
      skip: (validatedQuery.page - 1) * validatedQuery.limit,
      take: validatedQuery.limit,
    });

    return successResponse(
      {
        reports,
        pagination: {
          total,
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          totalPages: Math.ceil(total / validatedQuery.limit),
        },
      },
      "Banka raporları listelendi"
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        "Geçersiz parametreler: " +
          error.issues.map((e) => e.message).join(", "),
        400
      );
    }
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
}

// POST - Yeni banka raporu oluştur
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body = await request.json();

    const validatedBody = PostBodySchema.parse(body);
    const { reportName, reportType, startDate, endDate, reportParameters } =
      validatedBody;

    const generatedBy = request.user?.userId;
    if (!generatedBy) {
      return errorResponse("Kullanıcı doğrulanamadı", 401);
    }

    let reportData: any = {};

    if (reportType === "BALANCE") {
      // Bakiye raporu
      const accounts = await prisma.bankAccount.findMany({
        where: { isActive: true },
        select: {
          id: true,
          bankName: true,
          iban: true,
          balance: true,
          currency: true,
        },
      });
      reportData = {
        accounts,
        totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
      };
    } else if (reportType === "TRANSACTION") {
      // İşlem raporu
      const whereClause: any = {};
      if (startDate) whereClause.transactionDate = { gte: new Date(startDate) };
      if (endDate)
        whereClause.transactionDate = {
          ...whereClause.transactionDate,
          lte: new Date(endDate),
        };

      const transactions = await prisma.bankTransaction.findMany({
        where: whereClause,
        include: {
          bankAccount: {
            select: { bankName: true, iban: true },
          },
        },
        orderBy: { transactionDate: "desc" },
      });
      reportData = {
        transactions,
        summary: {
          totalCount: transactions.length,
          totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        },
      };
    } else if (reportType === "RECONCILIATION") {
      // Mutabakat raporu
      reportData = {
        message: "Mutabakat raporu henüz geliştirilme aşamasında",
      };
    }

   
    const report = await prisma.bankReporting.create({
      data: {
        reportName,
        reportType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        reportParameters: reportParameters || undefined,
        reportData,
        generatedBy,
      },
      include: {
        generatedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(report, "Banka raporu başarıyla oluşturuldu");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        "Geçersiz veriler: " + error.issues.map((e) => e.message).join(", "),
        400
      );
    }
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    return errorResponse("Internal server error", 500);
  }
}

export const GET = requireManager(handleGet);
export const POST = requireManager(handlePost);
