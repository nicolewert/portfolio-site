import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const NOTION_BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID!

// In the v5 Notion API, databases are containers for "data sources".
// We need the data source ID (not database ID) to query pages.
let _dataSourceId: string | null = null

export async function getDataSourceId(): Promise<string> {
  if (_dataSourceId) return _dataSourceId

  const db = await notion.databases.retrieve({
    database_id: NOTION_BLOG_DATABASE_ID,
  })

  if (!('data_sources' in db) || !db.data_sources?.length) {
    throw new Error(
      'No data sources found for database. Check your NOTION_BLOG_DATABASE_ID.'
    )
  }

  _dataSourceId = db.data_sources[0].id
  return _dataSourceId
}
