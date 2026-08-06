import { useEffect, useState } from 'react'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { StatCards } from '@/components/dashboard/stat-cards'
import { EarningsChart } from '@/components/dashboard/earnings-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { VideoRail } from '@/components/dashboard/video-rail'
import { LeaderboardPreview } from '@/components/dashboard/leaderboard-preview'
import { ReferralProgress } from '@/components/dashboard/referral-progress'
import { AchievementsCard } from '@/components/dashboard/achievements-card'
import { NotificationsCard } from '@/components/dashboard/notifications-card'
import { DailyChallenges } from '@/components/dashboard/daily-challenges'
import {
  continueWatching as mockContinueWatching,
  featuredVideos as mockFeaturedVideos,
  recentlyWatched as mockRecentlyWatched,
} from '@/lib/mock-data'
import { getDashboardSummary } from '@/lib/api/userApi'
import { getVideos } from '@/lib/api/videoApi'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('earnhub_token')
      if (token) {
        try {
          const res = await getDashboardSummary(token)
          setSummary(res.data)
          
          const vidRes = await getVideos(token)
          const mappedVideos = vidRes.data?.videos?.map((v) => ({
            id: v._id,
            title: v.title,
            creator: v.uploadedBy?.name || 'Admin',
            verified: true,
            category: 'Task',
            thumbnail: v.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=640&auto=format&fit=crop',
            reward: v.reward || 5,
            duration: `${Math.floor(v.duration / 60) || 5}:${(v.duration % 60 || 0).toString().padStart(2, '0')}`,
            durationSeconds: v.duration || 300,
            difficulty: 'Medium',
            views: '1.2k',
            progress: 0,
            completed: false,
          })) || []
          setVideos(mappedVideos)
        } catch (error) {
          console.error("Failed to fetch dashboard data", error)
        }
      }
      setLoading(false)
    }
    fetchSummary()
  }, [])

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6">
      <WelcomeBanner />

      <StatCards summary={summary} />

      {/* Main split: content + insights */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <EarningsChart />
          <VideoRail
            title="Continue Watching"
            subtitle="Pick up where you left off and claim your reward"
            videos={videos.length > 0 ? videos.slice(0, 3) : mockContinueWatching}
          />
        </div>

        <div className="flex flex-col gap-6">
          <QuickActions />
          <ReferralProgress />
        </div>
      </div>

      {/* Featured grid */}
      <VideoRail
        title="Featured Videos"
        subtitle="Hand-picked, high-reward videos ready to watch"
        videos={videos.length > 0 ? videos : mockFeaturedVideos}
        grid
      />

      {/* Insights row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DailyChallenges />
        <LeaderboardPreview />
        <AchievementsCard />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <VideoRail
            title="Recently Watched"
            subtitle="Your completed videos and earnings"
            videos={videos.length > 0 ? videos.slice(0, 2) : mockRecentlyWatched}
          />
        </div>
        <NotificationsCard />
      </div>
    </div>
  )
}
