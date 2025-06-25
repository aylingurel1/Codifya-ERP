import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Zaman penceresi (ms)
  maxRequests: number // Maksimum istek sayısı
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  private getClientKey(request: NextRequest): string {
    // IP adresi veya API key kullanarak client'ı tanımla
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    return ip
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  isAllowed(request: NextRequest): boolean {
    this.cleanup()
    
    const clientKey = this.getClientKey(request)
    const now = Date.now()
    
    if (!this.store[clientKey]) {
      this.store[clientKey] = {
        count: 1,
        resetTime: now + this.config.windowMs
      }
      return true
    }

    if (now > this.store[clientKey].resetTime) {
      // Zaman penceresi geçmiş, sıfırla
      this.store[clientKey] = {
        count: 1,
        resetTime: now + this.config.windowMs
      }
      return true
    }

    if (this.store[clientKey].count >= this.config.maxRequests) {
      return false
    }

    this.store[clientKey].count++
    return true
  }

  getRemainingRequests(request: NextRequest): number {
    const clientKey = this.getClientKey(request)
    const entry = this.store[clientKey]
    
    if (!entry) {
      return this.config.maxRequests
    }

    return Math.max(0, this.config.maxRequests - entry.count)
  }
}

// Varsayılan rate limiter (dakikada 100 istek)
const defaultRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 dakika
  maxRequests: 100
})

// Auth endpoint'leri için daha sıkı limit (dakikada 5 istek)
const authRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 dakika
  maxRequests: 5
})

export const rateLimit = (request: NextRequest): NextResponse | null => {
  const pathname = request.nextUrl.pathname
  
  // Auth endpoint'leri için daha sıkı limit
  if (pathname.startsWith('/api/auth/')) {
    if (!authRateLimiter.isAllowed(request)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  } else {
    // Diğer endpoint'ler için varsayılan limit
    if (!defaultRateLimiter.isAllowed(request)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  return null
} 