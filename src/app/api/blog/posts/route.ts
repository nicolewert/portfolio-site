import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/blog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const cursor = searchParams.get('cursor') || undefined

    const result = await getPublishedPosts({
      tag,
      category,
      search,
      limit,
      cursor,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/blog/posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
