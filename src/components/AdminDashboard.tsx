'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { BlogStats, BlogPost } from '../types/blog'
import { formatDate } from '../lib/utils'

interface AdminDashboardProps {
  stats: BlogStats
  recentPosts: BlogPost[]
}

export default function AdminDashboard({ stats, recentPosts }: AdminDashboardProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Nicole Wert</title>
        <meta name="description" content="Admin dashboard for Nicole Wert's blog" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Admin Dashboard</h1>
                <p className="text-[var(--secondary)]">Manage your blog content</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <Link
                  href="/admin/posts/new"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  New Post
                </Link>
                <Link
                  href="/admin/posts"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  All Posts
                </Link>
                <Link
                  href="/"
                  className="icy-button px-4 py-2 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h3 className="text-sm font-medium text-[var(--secondary)] mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-[var(--foreground)]">{stats.totalPosts}</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h3 className="text-sm font-medium text-[var(--secondary)] mb-2">Published</h3>
              <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h3 className="text-sm font-medium text-[var(--secondary)] mb-2">Drafts</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.draftPosts}</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h3 className="text-sm font-medium text-[var(--secondary)] mb-2">Tags</h3>
              <p className="text-3xl font-bold text-[var(--primary)]">{stats.totalTags}</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h3 className="text-sm font-medium text-[var(--secondary)] mb-2">Categories</h3>
              <p className="text-3xl font-bold text-[var(--primary)]">{stats.totalCategories}</p>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Recent Posts</h2>
              <Link
                href="/admin/posts"
                className="text-[var(--primary)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--secondary)] mb-4">No posts yet</p>
                <Link
                  href="/admin/posts/new"
                  className="icy-button px-6 py-3 text-[var(--foreground)] font-medium rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--background)]/50 border border-[var(--foreground)]/5">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--foreground)] mb-1">{post.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-[var(--secondary)]">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-3 py-1 text-sm text-[var(--primary)] hover:text-[var(--foreground)] transition-colors"
                      >
                        Edit
                      </Link>
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="px-3 py-1 text-sm text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}