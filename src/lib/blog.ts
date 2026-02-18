import { notion, getDataSourceId } from './notion'
import { NotionRenderer } from '@notion-render/client'
import hljsPlugin from '@notion-render/hljs-plugin'
import {
  BlogPost,
  Tag,
  Category,
  BlogPostFilters,
  BlogPostListResponse,
} from '../types/blog'
import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

// ---------------------------------------------------------------------------
// Notion color → hex lookup
// ---------------------------------------------------------------------------
const NOTION_COLOR_MAP: Record<string, string> = {
  default: '#6b7280',
  gray: '#9ca3af',
  brown: '#a16207',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  blue: '#2563eb',
  purple: '#7c3aed',
  pink: '#db2777',
  red: '#dc2626',
  light_gray: '#d1d5db',
}

function notionColorToHex(color: string): string {
  return NOTION_COLOR_MAP[color] ?? NOTION_COLOR_MAP.default
}

// ---------------------------------------------------------------------------
// In-memory cache (60-second TTL)
// ---------------------------------------------------------------------------
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_TTL_MS = 60_000

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function richTextToPlain(rt: RichTextItemResponse[]): string {
  return rt.map((t) => t.plain_text).join('')
}

function getProperty<T>(page: PageObjectResponse, name: string): T {
  return page.properties[name] as T
}

function pageToPost(
  page: PageObjectResponse
): Omit<BlogPost, 'content'> & { content: string } {
  const titleProp = getProperty<{
    type: 'title'
    title: RichTextItemResponse[]
  }>(page, 'Title')
  const slugProp = getProperty<{
    type: 'rich_text'
    rich_text: RichTextItemResponse[]
  }>(page, 'Slug')
  const excerptProp = getProperty<{
    type: 'rich_text'
    rich_text: RichTextItemResponse[]
  }>(page, 'Excerpt')
  const publishedProp = getProperty<{ type: 'checkbox'; checkbox: boolean }>(
    page,
    'Published'
  )
  const featuredImageProp = getProperty<{ type: 'url'; url: string | null }>(
    page,
    'Featured Image'
  )
  const metaDescProp = getProperty<{
    type: 'rich_text'
    rich_text: RichTextItemResponse[]
  }>(page, 'Meta Description')
  const tagsProp = getProperty<{
    type: 'multi_select'
    multi_select: Array<{ id: string; name: string; color: string }>
  }>(page, 'Tags')
  const categoriesProp = getProperty<{
    type: 'multi_select'
    multi_select: Array<{ id: string; name: string; color: string }>
  }>(page, 'Categories')
  const createdProp = getProperty<{
    type: 'created_time'
    created_time: string
  }>(page, 'Created')
  const updatedProp = getProperty<{
    type: 'last_edited_time'
    last_edited_time: string
  }>(page, 'Updated')

  const tags: Tag[] = (tagsProp?.multi_select ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.name.toLowerCase().replace(/\s+/g, '-'),
    color: notionColorToHex(t.color),
    created_at: createdProp?.created_time ?? new Date().toISOString(),
  }))

  const categories: Category[] = (categoriesProp?.multi_select ?? []).map(
    (c) => ({
      id: c.id,
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, '-'),
      color: notionColorToHex(c.color),
      created_at: createdProp?.created_time ?? new Date().toISOString(),
    })
  )

  return {
    id: page.id,
    title: richTextToPlain(titleProp?.title ?? []),
    slug: richTextToPlain(slugProp?.rich_text ?? []),
    content: '', // filled later for single-post fetches
    excerpt: richTextToPlain(excerptProp?.rich_text ?? []) || undefined,
    published: publishedProp?.checkbox ?? false,
    featured_image_url: featuredImageProp?.url ?? undefined,
    meta_description:
      richTextToPlain(metaDescProp?.rich_text ?? []) || undefined,
    tags,
    categories,
    created_at: createdProp?.created_time ?? new Date().toISOString(),
    updated_at: updatedProp?.last_edited_time ?? new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Fetch all blocks (paginated + recursive for nested blocks)
// ---------------------------------------------------------------------------

async function fetchAllBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results) {
      const b = block as BlockObjectResponse
      blocks.push(b)

      if (b.has_children) {
        const children = await fetchAllBlocks(b.id)
        blocks.push(...children)
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

// ---------------------------------------------------------------------------
// Render blocks to HTML
// ---------------------------------------------------------------------------

async function renderBlocksToHtml(
  blocks: BlockObjectResponse[]
): Promise<string> {
  const renderer = new NotionRenderer({ client: notion })
  await renderer.use(hljsPlugin({}))
  return renderer.render(...blocks)
}

// ---------------------------------------------------------------------------
// Public API — preserves existing function signatures
// ---------------------------------------------------------------------------

export async function getPublishedPosts(
  filters: BlogPostFilters = {}
): Promise<BlogPostListResponse> {
  const { tag, category, search, limit = 10, cursor } = filters

  const cacheKey = `posts:${tag ?? ''}:${category ?? ''}:${search ?? ''}:${limit}:${cursor ?? ''}`
  const cached = getCached<BlogPostListResponse>(cacheKey)
  if (cached) return cached

  // Build Notion filter
  const andFilters: Array<Record<string, unknown>> = [
    { property: 'Published', checkbox: { equals: true } },
  ]

  if (tag) {
    andFilters.push({ property: 'Tags', multi_select: { contains: tag } })
  }
  if (category) {
    andFilters.push({
      property: 'Categories',
      multi_select: { contains: category },
    })
  }
  if (search) {
    andFilters.push({
      or: [
        { property: 'Title', title: { contains: search } },
        { property: 'Excerpt', rich_text: { contains: search } },
      ],
    })
  }

  const filter = andFilters.length === 1 ? andFilters[0] : { and: andFilters }

  const dataSourceId = await getDataSourceId()
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: filter as Parameters<typeof notion.dataSources.query>[0]['filter'],
    sorts: [{ property: 'Created', direction: 'descending' as const }],
    page_size: limit,
    start_cursor: cursor,
  })

  const posts = (response.results as PageObjectResponse[]).map(pageToPost)
  const nextCursor = response.has_more
    ? (response.next_cursor ?? undefined)
    : undefined

  const result: BlogPostListResponse = {
    posts,
    total: posts.length,
    page: 1,
    limit,
    hasMore: response.has_more,
    nextCursor,
  }

  setCache(cacheKey, result)
  return result
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const cacheKey = `post:${slug}`
  const cached = getCached<BlogPost | null>(cacheKey)
  if (cached !== undefined) return cached

  const dataSourceId = await getDataSourceId()
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: 'Slug', rich_text: { equals: slug } },
        { property: 'Published', checkbox: { equals: true } },
      ],
    } as Parameters<typeof notion.dataSources.query>[0]['filter'],
    page_size: 1,
  })

  if (response.results.length === 0) {
    setCache(cacheKey, null)
    return null
  }

  const page = response.results[0] as PageObjectResponse
  const post = pageToPost(page)

  // Fetch and render page content
  const blocks = await fetchAllBlocks(page.id)
  const html = await renderBlocksToHtml(blocks)

  const fullPost: BlogPost = { ...post, content: html }
  setCache(cacheKey, fullPost)
  return fullPost
}

export async function getUsedTags(): Promise<Tag[]> {
  const cacheKey = 'usedTags'
  const cached = getCached<Tag[]>(cacheKey)
  if (cached) return cached

  const { posts } = await getPublishedPosts({ limit: 100 })

  const tagMap = new Map<string, Tag>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, tag)
      }
    }
  }

  const tags = Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  setCache(cacheKey, tags)
  return tags
}

export async function getUsedCategories(): Promise<Category[]> {
  const cacheKey = 'usedCategories'
  const cached = getCached<Category[]>(cacheKey)
  if (cached) return cached

  const { posts } = await getPublishedPosts({ limit: 100 })

  const catMap = new Map<string, Category>()
  for (const post of posts) {
    for (const cat of post.categories ?? []) {
      if (!catMap.has(cat.name)) {
        catMap.set(cat.name, cat)
      }
    }
  }

  const categories = Array.from(catMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  setCache(cacheKey, categories)
  return categories
}

export async function getTagsWithUsage(
  limit: number = 6
): Promise<(Tag & { postCount: number })[]> {
  const cacheKey = `tagsWithUsage:${limit}`
  const cached = getCached<(Tag & { postCount: number })[]>(cacheKey)
  if (cached) return cached

  const { posts } = await getPublishedPosts({ limit: 100 })

  const tagCounts = new Map<string, Tag & { postCount: number }>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const existing = tagCounts.get(tag.name)
      if (existing) {
        existing.postCount++
      } else {
        tagCounts.set(tag.name, { ...tag, postCount: 1 })
      }
    }
  }

  const result = Array.from(tagCounts.values())
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit)

  setCache(cacheKey, result)
  return result
}
