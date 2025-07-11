import { NextResponse } from 'next/server'
import { getBlogStats } from '@/lib/blog'

export async function GET() {
  try {
    const stats = await getBlogStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in GET /api/blog/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}