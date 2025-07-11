import { NextRequest, NextResponse } from 'next/server'
import { getAllTags, createTag } from '@/lib/blog'

export async function GET() {
  try {
    const tags = await getAllTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error in GET /api/blog/tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    const tag = await createTag(name, color)

    if (!tag) {
      return NextResponse.json(
        { error: 'Failed to create tag' },
        { status: 500 }
      )
    }

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/blog/tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
