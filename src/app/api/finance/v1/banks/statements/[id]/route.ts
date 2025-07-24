// app/api/finance/v1/banks/statements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBankStatementSchema = z.object({
  statementDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  balanceStart: z.number().optional(),
  balanceEnd: z.number().optional(),
  statementContent: z.any().optional(),
});

// PUT /api/finance/v1/banks/statements/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const statementId = resolvedParams.id;
    const body = await req.json();

    if (!statementId) {
      return NextResponse.json(
        { message: "Statement ID is required" },
        { status: 400 }
      );
    }

    const validationResult = updateBankStatementSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (validationResult.data.statementDate) {
      updateData.statementDate = new Date(validationResult.data.statementDate);
    }
    if (validationResult.data.startDate) {
      updateData.startDate = new Date(validationResult.data.startDate);
    }
    if (validationResult.data.endDate) {
      updateData.endDate = new Date(validationResult.data.endDate);
    }
    if (validationResult.data.balanceStart !== undefined) {
      updateData.balanceStart = validationResult.data.balanceStart;
    }
    if (validationResult.data.balanceEnd !== undefined) {
      updateData.balanceEnd = validationResult.data.balanceEnd;
    }
    if (validationResult.data.statementContent !== undefined) {
      updateData.statementContent = validationResult.data.statementContent;
    }

    const updatedStatement = await prisma.bankStatement.update({
      where: { id: statementId },
      data: updateData,
      include: {
        bankAccount: true,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedStatement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bank statement:", error);
    return NextResponse.json(
      { message: "Failed to update bank statement", error },
      { status: 500 }
    );
  }
}

// DELETE /api/finance/v1/banks/statements/[id]
export async function DELETE(
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

    // Check if statement exists
    const statement = await prisma.bankStatement.findUnique({
      where: { id: statementId },
    });

    if (!statement) {
      return NextResponse.json(
        { message: "Statement not found" },
        { status: 404 }
      );
    }

    await prisma.bankStatement.delete({
      where: { id: statementId },
    });

    return NextResponse.json(
      { success: true, message: "Statement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bank statement:", error);
    return NextResponse.json(
      { message: "Failed to delete bank statement", error },
      { status: 500 }
    );
  }
}

// GET /api/finance/v1/banks/statements/[id]
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

    return NextResponse.json(
      { success: true, data: statement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bank statement:", error);
    return NextResponse.json(
      { message: "Failed to fetch bank statement", error },
      { status: 500 }
    );
  }
}
