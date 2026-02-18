export const revalidate = 60

import BlogPostList from '../../components/BlogPostList'
import Head from 'next/head'
import Link from 'next/link'
import {
  getPublishedPosts,
  getUsedCategories,
  getTagsWithUsage,
} from '../../lib/blog'
import ExpandableTagList from '../../components/ExpandableTagList'
import { Suspense } from 'react'

interface BlogPageProps {
  searchParams: Promise<{
    search?: string
    tag?: string
    category?: string
  }>
}

export default async function Blog({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const { search, tag, category } = resolvedSearchParams

  // Fetch initial posts and filters
  try {
    const [initialPosts, categories, allUsedTags] = await Promise.all([
      getPublishedPosts({ search, tag, category, limit: 9 }),
      getUsedCategories(),
      getTagsWithUsage(50), // Get more tags for progressive disclosure
    ])

    return (
      <>
        <Head>
          <title>Blog | Nicole Wert</title>
          <meta
            name="description"
            content="Thoughts, tutorials, and insights on software engineering, AI, and career growth."
          />
        </Head>

        <main className="min-h-screen px-4 py-32 max-w-5xl mx-auto relative z-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-zinc-900 dark:text-white">
              The Archives
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Thoughts on code, AI, and building digital products.
            </p>
          </div>

          {/* Filter Tags and Categories - Only show if there are published posts */}
          {initialPosts.total > 0 &&
            (categories.length > 0 || allUsedTags.length > 0) && (
              <div className="max-w-4xl mx-auto mb-8 animate-fade-in delay-100">
                <div className="glass p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {/* All Posts */}
                    <Link
                      href="/blog"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        !search && !tag && !category
                          ? 'bg-[var(--primary)] text-white shadow-lg'
                          : 'text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                      }`}
                    >
                      All Posts
                    </Link>

                    {/* Categories - Only show used categories */}
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${cat.slug}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          category === cat.slug
                            ? 'text-white shadow-lg'
                            : 'text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                        }`}
                        style={{
                          backgroundColor:
                            category === cat.slug ? cat.color : 'transparent',
                          borderColor: `${cat.color}50`,
                          border: '1px solid',
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}

                    {/* Expandable Tags - Shows top 6 with expand option */}
                    <ExpandableTagList
                      tags={allUsedTags}
                      currentTag={tag}
                      maxVisible={6}
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Blog Posts */}
          <section className="animate-fade-in delay-200">
            <Suspense
              fallback={
                <div className="glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg text-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-[var(--foreground)]/10 rounded mb-4"></div>
                    <div className="h-4 bg-[var(--foreground)]/10 rounded mb-2"></div>
                    <div className="h-4 bg-[var(--foreground)]/10 rounded mb-2"></div>
                  </div>
                </div>
              }
            >
              <BlogPostList
                initialPosts={initialPosts}
                searchQuery={search}
                tagFilter={tag}
                categoryFilter={category}
              />
            </Suspense>
          </section>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error loading blog:', error)
    return (
      <main className="min-h-screen px-4 py-32 max-w-5xl mx-auto relative z-10 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          The Archives
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Unable to load posts at this time.
        </p>
      </main>
    )
  }
}
