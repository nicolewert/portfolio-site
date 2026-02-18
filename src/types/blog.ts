export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  featured_image_url?: string
  meta_description?: string
  created_at: string
  updated_at: string
  tags?: Tag[]
  categories?: Category[]
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

export interface BlogPostListResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  nextCursor?: string
}

export interface BlogPostFilters {
  tag?: string
  category?: string
  search?: string
  limit?: number
  cursor?: string
}
