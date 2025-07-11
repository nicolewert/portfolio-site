// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
} {
  const now = Date.now()
  const key = ip

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to clean up
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        rateLimitMap.delete(k)
      }
    }
  }

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // No record or expired, create new
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  record.count++
  rateLimitMap.set(key, record)

  return { allowed: true, remaining: MAX_REQUESTS - record.count }
}

export function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to a default (this shouldn't happen in production)
  return '127.0.0.1'
}
