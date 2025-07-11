import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from '../../../components/Navbar'
import { getPostBySlug, getPublishedPosts } from '../../../lib/blog'
import { formatDate } from '../../../lib/utils'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts({ limit: 100 })
  return posts.map((post) => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Nicole Wert',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${post.title} | Nicole Wert`,
    description: post.meta_description || post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || post.content.substring(0, 160),
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.excerpt || post.content.substring(0, 160),
      images: post.featured_image_url ? [post.featured_image_url] : []
    }
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <>
      <Head>
        <title>{post.title} | Nicole Wert</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.content.substring(0, 160)} />
      </Head>
      <Navbar />
      <main className="pt-32 pb-16 min-h-screen bg-[var(--background)]">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog */}
          <div className="mb-8 animate-fade-in">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-[var(--primary)] hover:text-[var(--foreground)] transition-colors font-medium group"
            >
              <svg 
                className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>

          {/* Article */}
          <article className="glass p-8 sm:p-12 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg animate-fade-in delay-100">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-4 text-[var(--secondary)] mb-6">
                <time dateTime={post.created_at} className="font-medium">
                  {formatDate(post.created_at)}
                </time>
                
                {post.categories && post.categories.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog?category=${category.slug}`}
                          className="px-3 py-1 rounded-full text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="px-3 py-1 rounded-full text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors glass"
                      style={{ backgroundColor: `${tag.color}15`, borderColor: `${tag.color}30` }}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div 
              className="prose prose-lg max-w-none text-[var(--foreground)] prose-headings:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-a:text-[var(--primary)] prose-a:hover:text-[var(--foreground)] prose-code:text-[var(--primary)] prose-code:bg-[var(--foreground)]/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[var(--foreground)]/5 prose-pre:border prose-pre:border-[var(--foreground)]/10 prose-blockquote:border-l-[var(--primary)] prose-blockquote:text-[var(--secondary)]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Back to Blog Footer */}
          <div className="mt-12 text-center animate-fade-in delay-200">
            <Link 
              href="/blog" 
              className="icy-button inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-2xl text-[var(--foreground)] shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Posts
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}