import { useEffect, useState } from 'react'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { StatCards } from '@/components/dashboard/stat-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { VideoRail } from '@/components/dashboard/video-rail'
import { getDashboardSummary } from '@/lib/api/userApi'
import { getVideos } from '@/lib/api/videoApi'
import useAuth from '@/hooks/useAuth'
import '../../styles/dashboard.css'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, refreshUser, user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const [summaryRes, videosRes] = await Promise.all([
          getDashboardSummary(token),
          getVideos(token),
        ])

        setSummary(summaryRes.data)

        const mappedVideos = videosRes.data?.videos?.map((v) => ({
          id: v._id,
          title: v.title,
          creator: v.uploadedBy?.name || 'Admin',
          thumbnail: v.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=640&auto=format&fit=crop',
          reward: v.reward || 0,
          duration: `${Math.floor((v.duration || 0) / 60)}:${((v.duration || 0) % 60).toString().padStart(2, '0')}`,
          durationSeconds: v.duration || 0,
        })) || []
        setVideos(mappedVideos)
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
      <WelcomeBanner name={summary?.name} />

      <StatCards summary={summary} />

      {videos.length > 0 && (
        <VideoRail
          title="Available Videos"
          subtitle="Watch videos and earn rewards"
          videos={videos}
          grid
        />
      )}

      <QuickActions />
    </div>
  )
}
