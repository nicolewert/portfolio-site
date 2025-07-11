import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '../../../lib/auth'
import { getAllPosts } from '../../../lib/blog'
import AdminPostsList from '../../../components/AdminPostsList'

export default async function AdminPosts() {
  // Check if user is authenticated
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }

  // Fetch all posts for admin
  const { posts } = await getAllPosts({ limit: 50 })

  return <AdminPostsList posts={posts} />
}
