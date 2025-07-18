import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

if (!ADMIN_PASSWORD_HASH) {
  throw new Error('ADMIN_PASSWORD_HASH environment variable is required')
}

// Type assertions after runtime checks
const jwtSecret: string = JWT_SECRET
const adminPasswordHash: string = ADMIN_PASSWORD_HASH

interface JWTPayload {
  admin: boolean
  exp: number
  iat: number
}

// TODO: Improve Rate limiting storage to redis, this is temporary
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function generateJWT(): string {
  return jwt.sign(
    {
      admin: true,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      iat: Math.floor(Date.now() / 1000),
    },
    jwtSecret
  )
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret)
    // Ensure the decoded token has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 'admin' in decoded) {
      return decoded as JWTPayload
    }
    return null
  } catch (error) {
    return null
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, adminPasswordHash)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }

  // Reset if more than 1 hour has passed
  if (now - attempts.lastAttempt > 60 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }

  // Allow max 5 attempts per hour
  if (attempts.count >= 5) {
    return false
  }

  attempts.count++
  attempts.lastAttempt = now
  loginAttempts.set(ip, attempts)
  return true
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')

    if (!sessionCookie?.value) {
      return false
    }

    const payload = verifyJWT(sessionCookie.value)
    return payload?.admin === true
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return false
  }
}

export function checkAdminAuth(request: NextRequest): boolean {
  try {
    const sessionCookie = request.cookies.get('admin-session')

    if (!sessionCookie?.value) {
      return false
    }

    const payload = verifyJWT(sessionCookie.value)
    return payload?.admin === true
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return false
  }
}

// Utility to hash a new password (for setup)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}
