import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/utils/auth'
import { unauthorizedResponse, forbiddenResponse } from '@/utils/api'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export const authenticateRequest = async (request: NextRequest): Promise<AuthenticatedRequest> => {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader || undefined)
  
  if (!token) {
    throw new Error('No token provided')
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    throw new Error('Invalid token')
  }
  
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = payload
  return authenticatedRequest
}

export const requireAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest) => {
    try {
      const authenticatedRequest = await authenticateRequest(request)
      return handler(authenticatedRequest)
    } catch {
      return unauthorizedResponse()
    }
  }
}

export const requireRole = (allowedRoles: string[]) => {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      try {
        const authenticatedRequest = await authenticateRequest(request)
        
        if (!authenticatedRequest.user) {
          return unauthorizedResponse()
        }
        
        if (!allowedRoles.includes(authenticatedRequest.user.role)) {
          return forbiddenResponse()
        }
        
        return handler(authenticatedRequest)
      } catch {
        return unauthorizedResponse()
      }
    }
  }
}

export const requireAdmin = requireRole(['ADMIN'])
export const requireManager = requireRole(['ADMIN', 'MANAGER']) 