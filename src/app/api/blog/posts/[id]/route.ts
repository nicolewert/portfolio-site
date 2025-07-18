import { NextRequest, NextResponse } from 'next/server'
import { updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { UpdateBlogPostData } from '@/types/blog'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body: Partial<UpdateBlogPostData> = await request.json()

    const updateData: UpdateBlogPostData = {
      id: params.id,
      ...body,
    }

    const post = await updateBlogPost(updateData)

    if (!post) {
      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error in PUT /api/blog/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const success = await deleteBlogPost(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete blog post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/blog/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
