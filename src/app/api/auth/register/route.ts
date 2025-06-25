import { NextRequest } from 'next/server'
import { AuthService } from '@/modules/auth/services/authService'
import { successResponse, errorResponse } from '@/utils/api'
import { CreateUserRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json()
    
    // Validation
    if (!body.email || !body.password || !body.name) {
      return errorResponse('Email, password and name are required')
    }

    if (body.password.length < 6) {
      return errorResponse('Password must be at least 6 characters long')
    }

    const authService = new AuthService()
    const user = await authService.register(body)

    return successResponse(user, 'User registered successfully')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
} 