import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export const successResponse = <T>(data: T, message?: string): NextResponse<ApiResponse<T>> => {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export const errorResponse = (error: string, status: number = 400): NextResponse<ApiResponse> => {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

export const unauthorizedResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Unauthorized', 401)
}

export const forbiddenResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Forbidden', 403)
}

export const notFoundResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Not found', 404)
}

export const serverErrorResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Internal server error', 500)
} 