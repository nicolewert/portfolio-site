'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost, BlogPostListResponse } from '@/types/blog'
import BlogPostCard from './BlogPostCard'

interface BlogPostListProps {
  initialPosts?: BlogPostListResponse
  searchQuery?: string
  tagFilter?: string
  categoryFilter?: string
}

export default function BlogPostList({ 
  initialPosts, 
  searchQuery, 
  tagFilter, 
  categoryFilter 
}: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts?.posts || [])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts?.hasMore || false)
  const [page, setPage] = useState(1)

  const loadPosts = useCallback(async (reset = false) => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams({
        page: reset ? '1' : (page + 1).toString(),
        limit: '9'
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (tagFilter) params.append('tag', tagFilter)
      if (categoryFilter) params.append('category', categoryFilter)

      const response = await fetch(`/api/blog/posts?${params}`)
      const data: BlogPostListResponse = await response.json()
      
      if (reset) {
        setPosts(data.posts)
        setPage(1)
      } else {
        setPosts(prev => [...prev, ...data.posts])
        setPage(prev => prev + 1)
      }
      
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, tagFilter, categoryFilter, page])

  useEffect(() => {
    if (searchQuery || tagFilter || categoryFilter) {
      loadPosts(true)
    }
  }, [searchQuery, tagFilter, categoryFilter, loadPosts])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts()
    }
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg text-center">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No posts found</h3>
        <p className="text-[var(--secondary)]">
          {searchQuery || tagFilter || categoryFilter 
            ? 'Try adjusting your search filters.'
            : 'Check back soon for new content!'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {posts.length > 0 && !searchQuery && !tagFilter && !categoryFilter && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Featured Post</h2>
          <BlogPostCard post={posts[0]} featured={true} />
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(searchQuery || tagFilter || categoryFilter ? 0 : 1).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="icy-button inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-2xl text-[var(--foreground)] shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--foreground)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </button>
        </div>
      )}
    </div>
  )
}