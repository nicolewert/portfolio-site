'use client'

import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { BlogPost } from '../types/blog'
import { formatDate } from '../lib/utils'

interface AdminPostsListProps {
  posts: BlogPost[]
}

export default function AdminPostsList({ posts }: AdminPostsListProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeleteLoading(postId)
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <>
      <Head>
        <title>All Posts | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">All Posts</h1>
                <p className="text-[var(--secondary)]">Manage all your blog posts</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <Link
                  href="/admin/posts/new"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  New Post
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">No posts yet</h3>
                <p className="text-[var(--secondary)] mb-6">Create your first blog post to get started.</p>
                <Link
                  href="/admin/posts/new"
                  className="icy-button px-6 py-3 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--foreground)]/10">
                      <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold">Title</th>
                      <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold">Status</th>
                      <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold">Created</th>
                      <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold">Updated</th>
                      <th className="text-center py-4 px-2 text-[var(--foreground)] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-[var(--foreground)]/5 hover:bg-[var(--foreground)]/5">
                        <td className="py-4 px-2">
                          <div>
                            <h3 className="font-medium text-[var(--foreground)] mb-1">{post.title}</h3>
                            <p className="text-sm text-[var(--secondary)] truncate max-w-xs">
                              {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm text-[var(--secondary)]">
                          {formatDate(post.created_at)}
                        </td>
                        <td className="py-4 px-2 text-sm text-[var(--secondary)]">
                          {formatDate(post.updated_at)}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-center gap-2">
                            {post.published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-xs px-2 py-1 text-[var(--primary)] hover:text-[var(--foreground)] transition-colors"
                              >
                                View
                              </Link>
                            )}
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="text-xs px-2 py-1 text-[var(--primary)] hover:text-[var(--foreground)] transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
                              disabled={deleteLoading === post.id}
                              className="text-xs px-2 py-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              {deleteLoading === post.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}