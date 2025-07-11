import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')
    return session?.value === 'authenticated'
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return false
  }
}

export function checkAdminAuth(request: NextRequest): boolean {
  try {
    const session = request.cookies.get('admin-session')
    return session?.value === 'authenticated'
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return false
  }
}
