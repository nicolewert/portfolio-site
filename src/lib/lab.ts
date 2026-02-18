import { notion } from './notion'
import type { LabItem } from '../types/lab'
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

const NOTION_LAB_DATABASE_ID = process.env.NOTION_LAB_DATABASE_ID!

// ---------------------------------------------------------------------------
// Notion color → hex lookup (duplicated from blog.ts to avoid coupling)
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
// Data source ID cache (same pattern as blog, separate cache)
// ---------------------------------------------------------------------------
let _labDataSourceId: string | null = null

async function getLabDataSourceId(): Promise<string> {
  if (_labDataSourceId) return _labDataSourceId

  const db = await notion.databases.retrieve({
    database_id: NOTION_LAB_DATABASE_ID,
  })

  if (!('data_sources' in db) || !db.data_sources?.length) {
    throw new Error(
      'No data sources found for Lab database. Check your NOTION_LAB_DATABASE_ID.'
    )
  }

  _labDataSourceId = db.data_sources[0].id
  return _labDataSourceId
}

// ---------------------------------------------------------------------------
// In-memory cache (60-second TTL)
// ---------------------------------------------------------------------------
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

let labCache: CacheEntry<LabItem[]> | null = null
const CACHE_TTL_MS = 60_000

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function richTextToPlain(rt: RichTextItemResponse[]): string {
  return rt.map((t) => t.plain_text).join('')
}

function getProperty<T>(page: PageObjectResponse, name: string): T {
  return page.properties[name] as T
}

function pageToLabItem(page: PageObjectResponse): LabItem {
  const titleProp = getProperty<{
    type: 'title'
    title: RichTextItemResponse[]
  }>(page, 'Name')

  const descProp = getProperty<{
    type: 'rich_text'
    rich_text: RichTextItemResponse[]
  }>(page, 'Description')

  const featuredImageProp = getProperty<{ type: 'url'; url: string | null }>(
    page,
    'Featured Image'
  )

  const tagsProp = getProperty<{
    type: 'multi_select'
    multi_select: Array<{ id: string; name: string; color: string }>
  }>(page, 'Tags')

  const linkProp = getProperty<{ type: 'url'; url: string | null }>(
    page,
    'Link'
  )

  const createdProp = getProperty<{
    type: 'created_time'
    created_time: string
  }>(page, 'Created time')

  return {
    id: page.id,
    title: richTextToPlain(titleProp?.title ?? []),
    description: richTextToPlain(descProp?.rich_text ?? []),
    featured_image_url: featuredImageProp?.url ?? undefined,
    tags: (tagsProp?.multi_select ?? []).map((t) => ({
      name: t.name,
      color: notionColorToHex(t.color),
    })),
    link: linkProp?.url ?? undefined,
    created_at: createdProp?.created_time ?? new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getPublishedLabItems(): Promise<LabItem[]> {
  if (labCache && Date.now() < labCache.expiresAt) {
    return labCache.data
  }

  const dataSourceId = await getLabDataSourceId()

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    } as Parameters<typeof notion.dataSources.query>[0]['filter'],
    sorts: [{ property: 'Created time', direction: 'descending' as const }],
    page_size: 20,
  })

  const items = (response.results as PageObjectResponse[]).map(pageToLabItem)

  labCache = { data: items, expiresAt: Date.now() + CACHE_TTL_MS }
  return items
}
