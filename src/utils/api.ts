import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const successResponse = <T>(
  data: T,
  message?: string,
  meta?: PaginationMeta,
  status: number = 200
): NextResponse<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };

  if (meta) {
    response.meta = meta;
  }

  return NextResponse.json(response, { status });
};

export const errorResponse = (
  error: string,
  status: number = 400,
  details?: Record<string, any>
): NextResponse<ApiResponse> => {
  const response: ApiResponse = {
    success: false,
    error,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
};

export const unauthorizedResponse = (): NextResponse<ApiResponse> => {
  return errorResponse("Unauthorized", 401);
};

export const forbiddenResponse = (): NextResponse<ApiResponse> => {
  return errorResponse("Forbidden", 403);
};

export const notFoundResponse = (): NextResponse<ApiResponse> => {
  return errorResponse("Not found", 404);
};

export const serverErrorResponse = (): NextResponse<ApiResponse> => {
  return errorResponse("Internal server error", 500);
};

export const conflictResponse = (
  message: string = "Resource conflict"
): NextResponse<ApiResponse> => {
  return errorResponse(message, 409);
};

export const validationErrorResponse = (
  details: Record<string, string[]>
): NextResponse<ApiResponse> => {
  return errorResponse("Validation failed", 400, details);
};

// Pagination helper
export const createPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
