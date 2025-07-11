'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import {
  BlogPost,
  Tag,
  Category,
  CreateBlogPostData,
  UpdateBlogPostData,
} from '../types/blog'
import { generateSlug } from '../lib/utils'

interface AdminPostFormProps {
  post?: BlogPost
  tags: Tag[]
  categories: Category[]
  isEditing: boolean
}

export default function AdminPostForm({
  post,
  tags,
  categories,
  isEditing,
}: AdminPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    published: post?.published || false,
    featured_image_url: post?.featured_image_url || '',
    meta_description: post?.meta_description || '',
    tag_ids: post?.tags?.map((t) => t.id) || [],
    category_ids: post?.categories?.map((c) => c.id) || [],
  })

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === generateSlug(prev.title)
          ? generateSlug(title)
          : prev.slug,
    }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/blog/posts/${post!.id}` : '/api/blog/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const body: CreateBlogPostData | UpdateBlogPostData = isEditing
        ? { id: post!.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save post'}`)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit Post' : 'New Post'} | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {isEditing ? 'Edit Post' : 'New Post'}
                </h1>
                <p className="text-[var(--secondary)]">
                  {isEditing
                    ? 'Update your blog post'
                    : 'Create a new blog post'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <Link
                  href="/admin/posts"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  ← Back to Posts
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                  placeholder="Enter post title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                  placeholder="post-url-slug"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-y"
                  placeholder="Write your post content here... (HTML supported)"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Excerpt
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-y"
                  placeholder="Brief description of your post (optional)"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_image_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/50 text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-y"
                  placeholder="SEO description for search engines"
                />
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          formData.category_ids.includes(category.id)
                            ? 'text-white shadow-lg'
                            : 'text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                        }`}
                        style={{
                          backgroundColor: formData.category_ids.includes(
                            category.id
                          )
                            ? category.color
                            : 'transparent',
                          borderColor: `${category.color}50`,
                          border: '1px solid',
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          formData.tag_ids.includes(tag.id)
                            ? 'text-white shadow-lg'
                            : 'text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                        }`}
                        style={{
                          backgroundColor: formData.tag_ids.includes(tag.id)
                            ? tag.color
                            : 'transparent',
                          borderColor: `${tag.color}50`,
                          border: '1px solid',
                        }}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                  className="mr-3 h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]/50 border-[var(--foreground)]/10 rounded"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-[var(--foreground)]"
                >
                  Publish immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="icy-button px-6 py-3 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Post'
                      : 'Create Post'}
                </button>
                <Link
                  href="/admin/posts"
                  className="px-6 py-3 text-[var(--secondary)] hover:text-[var(--foreground)] font-medium rounded-lg border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/5 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
