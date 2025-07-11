import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts, getAllPosts, createBlogPost } from '@/lib/blog'
import { CreateBlogPostData } from '@/types/blog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const includeUnpublished = searchParams.get('admin') === 'true'

    const offset = (page - 1) * limit

    const result = includeUnpublished 
      ? await getAllPosts({ tag, category, search, limit, offset })
      : await getPublishedPosts({ tag, category, search, limit, offset })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/blog/posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBlogPostData = await request.json()
    
    // Basic validation
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await createBlogPost(body)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      )
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/blog/posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}