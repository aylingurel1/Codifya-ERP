// app/api/finance/v1/banks/statements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const getBankStatementsSchema = z.object({
  accountId: z.string().min(1, "Bank account ID is required"),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

const createBankStatementSchema = z.object({
  bankAccountId: z.string().min(1, "Bank account ID is required"),
  statementDate: z.string().min(1, "Statement date is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  balanceStart: z.number(),
  balanceEnd: z.number(),
  statementContent: z.any().optional(),
  createdBy: z.string().optional(),
});

// GET /api/finance/banks/statements
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    console.log("Bank statements API called with params:", {
      accountId: searchParams.get("accountId"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });

    // Validate query parameters
    const validationResult = getBankStatementsSchema.safeParse({
      accountId: searchParams.get("accountId"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.issues);
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      accountId: bankAccountId,
      startDate,
      endDate,
    } = validationResult.data;

    const where: any = {
      bankAccountId: bankAccountId,
    };

    // Tarih filtreleme - ekstre tarihini temel al
    if (startDate && startDate !== null) {
      where.statementDate = {
        ...where.statementDate,
        gte: new Date(startDate),
      };
    }
    if (endDate && endDate !== null) {
      where.statementDate = {
        ...where.statementDate,
        lte: new Date(endDate),
      };
    }

    const bankStatements = await prisma.bankStatement.findMany({
      where,
      include: {
        bankAccount: true, // Include related bank account info
      },
      orderBy: {
        statementDate: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: bankStatements },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bank statements:", error);
    return NextResponse.json(
      { message: "Failed to fetch bank statements.", error },
      { status: 500 }
    );
  }
}

// POST /api/finance/banks/statements
// Creates a new bank statement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = createBankStatementSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      bankAccountId,
      statementDate,
      startDate,
      endDate,
      balanceStart,
      balanceEnd,
      statementContent,
      createdBy,
    } = validationResult.data;

    const newBankStatement = await prisma.bankStatement.create({
      data: {
        bankAccountId,
        statementDate: new Date(statementDate),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        balanceStart,
        balanceEnd,
        statementContent,
      },
    });

    return NextResponse.json(
      { success: true, data: newBankStatement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bank statement:", error);
    return NextResponse.json(
      { message: "Failed to create bank statement.", error },
      { status: 500 }
    );
  }
}
