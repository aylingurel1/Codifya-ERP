import { NextRequest } from 'next/server'
import { AuthService, LoginRequest } from '@/modules/auth/services/authService'
import { successResponse, errorResponse } from '@/utils/api'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    
    // Validation
    if (!body.email || !body.password) {
      return errorResponse('Email and password are required')
    }

    const authService = new AuthService()
    const result = await authService.login(body)

    return successResponse(result, 'Login successful')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
} 