import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/utils/api'
import { requireManager, AuthenticatedRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Müşteri listesi
async function handleGet(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    const total = await prisma.customer.count({ where })
    const customers = await prisma.customer.findMany({
      where,
      include: {
        createdByUser: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return successResponse({
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }, 'Müşteriler listelendi')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

// POST - Yeni müşteri oluşturma
async function handlePost(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name) {
      return errorResponse('Müşteri adı zorunludur')
    }

    if (body.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: body.email }
      })
      if (existingCustomer) {
        return errorResponse('Bu email adresi zaten kullanılıyor')
      }
    }

    const createdBy = request.user?.userId
    if (!createdBy) {
      return errorResponse('Kullanıcı doğrulanamadı', 401)
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        company: body.company,
        taxNumber: body.taxNumber,
        createdBy
      },
      include: {
        createdByUser: true
      }
    })

    return successResponse(customer, 'Müşteri başarıyla oluşturuldu')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse('Internal server error', 500)
  }
}

export const GET = requireManager(handleGet)
export const POST = requireManager(handlePost) 