import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '../../../../lib/auth'
import { getAllTags, getAllCategories } from '../../../../lib/blog'
import AdminPostForm from '../../../../components/AdminPostForm'

export default async function NewPost() {
  // Check if user is authenticated
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }

  // Fetch tags and categories for the form
  const [tags, categories] = await Promise.all([
    getAllTags(),
    getAllCategories(),
  ])

  return <AdminPostForm tags={tags} categories={categories} isEditing={false} />
}
