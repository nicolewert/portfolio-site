import { supabase, supabaseAdmin } from './supabase'
import { generateSlug } from './utils'
import {
  BlogPost,
  Tag,
  Category,
  CreateBlogPostData,
  UpdateBlogPostData,
  BlogPostFilters,
  BlogPostListResponse,
  BlogStats,
} from '../types/blog'

// Public blog functions (for readers)
export async function getPublishedPosts(
  filters: BlogPostFilters = {}
): Promise<BlogPostListResponse> {
  const { tag, category, search, limit = 10, offset = 0 } = filters

  let query = supabase
    .from('blog_posts')
    .select(
      `
      *,
      tags:post_tags(tag:tags(*)),
      categories:post_categories(category:categories(*))
    `
    )
    .eq('published', true)
    .order('created_at', { ascending: false })

  // Apply filters
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`
    )
  }

  if (tag) {
    query = query.contains('tags', [{ slug: tag }])
  }

  if (category) {
    query = query.contains('categories', [{ slug: category }])
  }

  // Get total count for pagination
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  // Apply pagination
  const { data: posts, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return {
      posts: [],
      total: 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: false,
    }
  }

  // Transform the data to match our interface
  const transformedPosts: BlogPost[] = posts.map((post) => ({
    ...post,
    tags: post.tags?.map((pt: { tag: Tag }) => pt.tag).filter(Boolean) || [],
    categories:
      post.categories
        ?.map((pc: { category: Category }) => pc.category)
        .filter(Boolean) || [],
  }))

  return {
    posts: transformedPosts,
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + limit < (count || 0),
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      tags:post_tags(tag:tags(*)),
      categories:post_categories(category:categories(*))
    `
    )
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    tags: data.tags?.map((pt: { tag: Tag }) => pt.tag).filter(Boolean) || [],
    categories:
      data.categories
        ?.map((pc: { category: Category }) => pc.category)
        .filter(Boolean) || [],
  }
}

export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from('tags').select('*').order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  return data || []
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Get only tags that are used in published posts
export async function getUsedTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select(
      `
      *,
      post_tags!inner(
        post:blog_posts!inner(published)
      )
    `
    )
    .eq('post_tags.post.published', true)
    .order('name')

  if (error) {
    console.error('Error fetching used tags:', error)
    return []
  }

  // Remove duplicates and flatten the structure
  const uniqueTags =
    data?.reduce((acc: Tag[], current) => {
      if (!acc.find((tag) => tag.id === current.id)) {
        const { post_tags, ...tag } = current
        acc.push(tag as Tag)
      }
      return acc
    }, []) || []

  return uniqueTags
}

// Get only categories that are used in published posts
export async function getUsedCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      *,
      post_categories!inner(
        post:blog_posts!inner(published)
      )
    `
    )
    .eq('post_categories.post.published', true)
    .order('name')

  if (error) {
    console.error('Error fetching used categories:', error)
    return []
  }

  // Remove duplicates and flatten the structure
  const uniqueCategories =
    data?.reduce((acc: Category[], current) => {
      if (!acc.find((cat) => cat.id === current.id)) {
        const { post_categories, ...category } = current
        acc.push(category as Category)
      }
      return acc
    }, []) || []

  return uniqueCategories
}

// Get tags with usage count, sorted by most used
export async function getTagsWithUsage(
  limit: number = 6
): Promise<(Tag & { postCount: number })[]> {
  const { data, error } = await supabase
    .from('tags')
    .select(
      `
      *,
      post_tags!inner(
        post:blog_posts!inner(published)
      )
    `
    )
    .eq('post_tags.post.published', true)

  if (error) {
    console.error('Error fetching tags with usage:', error)
    return []
  }

  // Group by tag and count posts
  const tagCounts =
    data?.reduce(
      (acc: Record<string, Tag & { postCount: number }>, current) => {
        const { post_tags, ...tag } = current
        const tagId = tag.id

        if (!acc[tagId]) {
          acc[tagId] = { ...(tag as Tag), postCount: 0 }
        }
        acc[tagId].postCount++

        return acc
      },
      {}
    ) || {}

  // Convert to array and sort by usage
  return Object.values(tagCounts)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit)
}

// Admin blog functions (for content management)
export async function createBlogPost(
  postData: CreateBlogPostData
): Promise<BlogPost | null> {
  const { tag_ids, category_ids, ...blogPostData } = postData

  // Create the blog post
  const { data: post, error: postError } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...blogPostData,
      slug: blogPostData.slug || generateSlug(blogPostData.title),
    })
    .select()
    .single()

  if (postError || !post) {
    console.error('Error creating blog post:', postError)
    return null
  }

  // Add tags if provided
  if (tag_ids && tag_ids.length > 0) {
    const tagInserts = tag_ids.map((tag_id) => ({
      post_id: post.id,
      tag_id,
    }))

    const { error: tagError } = await supabaseAdmin
      .from('post_tags')
      .insert(tagInserts)

    if (tagError) {
      console.error('Error adding tags to post:', tagError)
    }
  }

  // Add categories if provided
  if (category_ids && category_ids.length > 0) {
    const categoryInserts = category_ids.map((category_id) => ({
      post_id: post.id,
      category_id,
    }))

    const { error: categoryError } = await supabaseAdmin
      .from('post_categories')
      .insert(categoryInserts)

    if (categoryError) {
      console.error('Error adding categories to post:', categoryError)
    }
  }

  return post
}

export async function updateBlogPost(
  postData: UpdateBlogPostData
): Promise<BlogPost | null> {
  const { id, tag_ids, category_ids, ...updateData } = postData

  // Update the blog post
  const { data: post, error: postError } = await supabaseAdmin
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (postError || !post) {
    console.error('Error updating blog post:', postError)
    return null
  }

  // Update tags if provided
  if (tag_ids !== undefined) {
    // Remove existing tags
    await supabaseAdmin.from('post_tags').delete().eq('post_id', id)

    // Add new tags
    if (tag_ids.length > 0) {
      const tagInserts = tag_ids.map((tag_id) => ({
        post_id: id,
        tag_id,
      }))

      const { error: tagError } = await supabaseAdmin
        .from('post_tags')
        .insert(tagInserts)

      if (tagError) {
        console.error('Error updating tags for post:', tagError)
      }
    }
  }

  // Update categories if provided
  if (category_ids !== undefined) {
    // Remove existing categories
    await supabaseAdmin.from('post_categories').delete().eq('post_id', id)

    // Add new categories
    if (category_ids.length > 0) {
      const categoryInserts = category_ids.map((category_id) => ({
        post_id: id,
        category_id,
      }))

      const { error: categoryError } = await supabaseAdmin
        .from('post_categories')
        .insert(categoryInserts)

      if (categoryError) {
        console.error('Error updating categories for post:', categoryError)
      }
    }
  }

  return post
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return false
  }

  return true
}

export async function getAllPosts(
  filters: BlogPostFilters = {}
): Promise<BlogPostListResponse> {
  const { published, search, limit = 10, offset = 0 } = filters

  let query = supabaseAdmin
    .from('blog_posts')
    .select(
      `
      *,
      tags:post_tags(tag:tags(*)),
      categories:post_categories(category:categories(*))
    `
    )
    .order('created_at', { ascending: false })

  // Apply filters
  if (published !== undefined) {
    query = query.eq('published', published)
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`
    )
  }

  // Get total count for pagination
  const { count } = await supabaseAdmin
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  // Apply pagination
  const { data: posts, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching all blog posts:', error)
    return {
      posts: [],
      total: 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: false,
    }
  }

  // Transform the data to match our interface
  const transformedPosts: BlogPost[] = posts.map((post) => ({
    ...post,
    tags: post.tags?.map((pt: { tag: Tag }) => pt.tag).filter(Boolean) || [],
    categories:
      post.categories
        ?.map((pc: { category: Category }) => pc.category)
        .filter(Boolean) || [],
  }))

  return {
    posts: transformedPosts,
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + limit < (count || 0),
  }
}

export async function getBlogStats(): Promise<BlogStats> {
  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: draftPosts },
    { count: totalTags },
    { count: totalCategories },
    { data: recentPosts },
  ] = await Promise.all([
    supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true),
    supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', false),
    supabaseAdmin.from('tags').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    draftPosts: draftPosts || 0,
    totalTags: totalTags || 0,
    totalCategories: totalCategories || 0,
    recentPosts: recentPosts || [],
  }
}

// Tag and category management
export async function createTag(
  name: string,
  color: string = '#3b5bdb'
): Promise<Tag | null> {
  const { data, error } = await supabaseAdmin
    .from('tags')
    .insert({
      name,
      slug: generateSlug(name),
      color,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating tag:', error)
    return null
  }

  return data
}

export async function createCategory(
  name: string,
  description?: string,
  color: string = '#b3c7e6'
): Promise<Category | null> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name,
      slug: generateSlug(name),
      description,
      color,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return null
  }

  return data
}
