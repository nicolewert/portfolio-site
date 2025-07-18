export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  featured_image_url?: string
  meta_description?: string
  author_id: string
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
  description?: string
  color: string
  created_at: string
}

export interface PostTag {
  id: string
  post_id: string
  tag_id: string
  created_at: string
}

export interface PostCategory {
  id: string
  post_id: string
  category_id: string
  created_at: string
}

// For creating/updating blog posts
export interface CreateBlogPostData {
  title: string
  slug: string
  content: string
  excerpt?: string
  published?: boolean
  featured_image_url?: string
  meta_description?: string
  tag_ids?: string[]
  category_ids?: string[]
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string
}

// For blog post listing with pagination
export interface BlogPostListResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// For filtering blog posts
export interface BlogPostFilters {
  published?: boolean
  tag?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}

// For admin dashboard
export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalTags: number
  totalCategories: number
  recentPosts: BlogPost[]
}
