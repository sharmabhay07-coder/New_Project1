import { useEffect, useState } from 'react'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';
import { getDashboardSummary } from '@/lib/api/userApi'
import useAuth from '@/hooks/useAuth'
import '../../styles/dashboard.css'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token, refreshUser, user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const summaryRes = await getDashboardSummary(token);
        setSummary(summaryRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    if (summary && !user?.name) {
      refreshUser()
    }
  }, [summary, refreshUser, user?.name])

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-skeleton-card" style={{ height: 120 }} />
        <div className="dash-grid dash-grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dash-skeleton-card" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page dash-space-y-6">
      <WelcomeBanner name={summary?.name} summary={summary} />

      <QuickActions />

      <RecentActivity />
    </div>
  )
}
