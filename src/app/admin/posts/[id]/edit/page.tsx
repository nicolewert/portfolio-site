import { redirect, notFound } from 'next/navigation'
import { isAdminAuthenticated } from '../../../../../lib/auth'
import {
  getAllPosts,
  getAllTags,
  getAllCategories,
} from '../../../../../lib/blog'
import AdminPostForm from '../../../../../components/AdminPostForm'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPost({ params }: EditPostPageProps) {
  // Check if user is authenticated
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }

  const resolvedParams = await params
  const postId = resolvedParams.id

  // Fetch the post and form data
  const [{ posts }, tags, categories] = await Promise.all([
    getAllPosts({ limit: 1000 }), // Get all posts to find the one we need
    getAllTags(),
    getAllCategories(),
  ])

  const post = posts.find((p) => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <AdminPostForm
      post={post}
      tags={tags}
      categories={categories}
      isEditing={true}
    />
  )
}
