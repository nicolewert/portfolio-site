import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '../../../lib/auth'
import { getBlogStats, getAllPosts } from '../../../lib/blog'
import AdminDashboard from '../../../components/AdminDashboard'

export default async function Dashboard() {
  // Check if user is authenticated
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }

  // Fetch dashboard data
  const [stats, { posts }] = await Promise.all([
    getBlogStats(),
    getAllPosts({ limit: 5 }),
  ])

  return <AdminDashboard stats={stats} recentPosts={posts} />
}
