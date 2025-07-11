import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, createCategory } from '@/lib/blog'

export async function GET() {
  try {
    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in GET /api/blog/categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, color } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const category = await createCategory(name, description, color)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/blog/categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}