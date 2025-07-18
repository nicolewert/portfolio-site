'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Tag {
  id: string
  name: string
  slug: string
  color: string
  postCount?: number
}

interface ExpandableTagListProps {
  tags: Tag[]
  currentTag?: string
  maxVisible?: number
}

export default function ExpandableTagList({
  tags,
  currentTag,
  maxVisible = 6,
}: ExpandableTagListProps) {
  const [showAll, setShowAll] = useState(false)

  if (tags.length === 0) return null

  const visibleTags = showAll ? tags : tags.slice(0, maxVisible)
  const hasMore = tags.length > maxVisible

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Visible Tags */}
      {visibleTags.map((t) => (
        <Link
          key={t.id}
          href={`/blog?tag=${t.slug}`}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            currentTag === t.slug
              ? 'text-white shadow-lg'
              : 'text-[var(--foreground)] hover:bg-[var(--primary)]/10'
          }`}
          style={{
            backgroundColor: currentTag === t.slug ? t.color : 'transparent',
            borderColor: `${t.color}50`,
            border: '1px solid',
          }}
          title={
            t.postCount
              ? `${t.postCount} post${t.postCount !== 1 ? 's' : ''}`
              : undefined
          }
        >
          #{t.name}
        </Link>
      ))}

      {/* Show More/Less Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1 rounded-full text-xs font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all duration-300 border border-[var(--foreground)]/10"
        >
          {showAll ? (
            <>Show less ({Math.max(0, tags.length - maxVisible)} fewer)</>
          ) : (
            <>+{tags.length - maxVisible} more</>
          )}
        </button>
      )}
    </div>
  )
}
