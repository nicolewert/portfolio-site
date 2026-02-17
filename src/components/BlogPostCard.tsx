'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/lib/utils'

interface BlogPostCardProps {
  post: BlogPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="glass rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-xl p-6">
      <div className="flex flex-col h-full">
        {/* Featured Image */}
        {post.featured_image_url ? (
          <div className="mb-4 rounded-xl overflow-hidden">
            <Image
              src={post.featured_image_url.trim()}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[var(--primary)]/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </div>
        )}

        {/* Post Meta */}
        <div className="flex items-center gap-2 mb-3">
          <time
            dateTime={post.created_at}
            className="text-sm text-[var(--secondary)] font-medium"
          >
            {formatDate(post.created_at)}
          </time>
          {post.categories && post.categories.length > 0 && (
            <span className="text-[var(--secondary)]">•</span>
          )}
          {post.categories?.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
              className="text-sm px-2 py-1 rounded-full text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="font-bold text-[var(--foreground)] mb-3 line-clamp-2 hover:text-[var(--primary)] transition-colors text-xl">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-[var(--secondary)] mb-4 line-clamp-3 flex-grow">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="text-xs px-2 py-1 rounded-full text-[var(--foreground)] hover:text-[var(--primary)] transition-colors glass"
                style={{
                  backgroundColor: `${tag.color}15`,
                  borderColor: `${tag.color}30`,
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-[var(--primary)] hover:text-[var(--foreground)] transition-colors font-medium group"
        >
          Read more
          <svg
            className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}
