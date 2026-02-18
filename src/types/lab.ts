export interface LabItem {
  id: string
  title: string
  description: string
  featured_image_url?: string
  tags: { name: string; color: string }[]
  link?: string
  created_at: string
}
