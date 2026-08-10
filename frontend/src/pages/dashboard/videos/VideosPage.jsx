import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { PlaySquare, Star, Clock, CheckCircle, Filter } from 'lucide-react'
import { getVideos } from '@/lib/api/videoApi'
import useAuth from '@/hooks/useAuth'

const CATEGORIES = ['All', 'Finance', 'Technology', 'Travel', 'Fitness', 'Gaming', 'Cooking']

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''

  const { token } = useAuth()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (token) {
          const res = await getVideos(token)
          const mapped = res.data?.videos?.map(v => ({
            id: v._id,
            title: v.title,
            creator: v.uploadedBy?.name || 'Admin',
            category: 'General',
            thumbnail: v.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=640',
            reward: v.reward || 5,
            duration: `${Math.floor((v.duration || 300) / 60)}:${((v.duration || 300) % 60).toString().padStart(2, '0')}`,
            completed: false,
          })) || []
          setVideos(mapped)
        }
      } catch {
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const categoryFiltered = activeCategory === 'All'
    ? videos
    : videos.filter(v => v.category === activeCategory)

  const searchFiltered = searchQuery
    ? categoryFiltered.filter(v =>
        v.title.toLowerCase().includes(searchQuery) ||
        v.creator.toLowerCase().includes(searchQuery)
      )
    : categoryFiltered

  const displayVideos = searchFiltered

  return (
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Watch &amp; Earn</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Watch videos and earn real rewards for every minute.</p>
      </div>

      <div className="dash-grid dash-grid-cols-1 dash-gap-4">
        {[
          { label: 'Videos Available', value: videos.length, icon: PlaySquare, color: 'dash-text-primary' },
          { label: 'Avg Reward', value: `$${videos.length ? (videos.reduce((a,v) => a + (v.reward||0), 0) / videos.length).toFixed(2) : '0.00'}`, icon: Star, color: 'dash-text-warning' },
          { label: 'Total Earned Today', value: '$0.00', icon: CheckCircle, color: 'dash-text-success' },
        ].map((stat) => (
          <div key={stat.label} className="dash-card dash-p-6 dash-shadow-soft">
            <div className="dash-flex dash-items-center dash-gap-2">
              <stat.icon className={'dash-size-4 ' + stat.color} />
              <span className="dash-text-xs dash-text-muted-foreground">{stat.label}</span>
            </div>
            <p className="dash-mt-1 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="dash-flex dash-items-center dash-gap-2 dash-overflow-x-auto dash-pb-1 dash-scrollbar-hide">
        <Filter className="dash-size-4 dash-shrink-0 dash-text-muted-foreground" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={
              'dash-shrink-0 dash-rounded-xl dash-px-4 dash-py-1.5 dash-text-sm dash-font-medium dash-transition-all ' +
              (activeCategory === cat
                ? 'dash-bg-primary dash-text-primary-foreground dash-shadow-soft-primary'
                : 'dash-border dash-border-border dash-bg-card dash-text-muted-foreground dash-hover:text-foreground')
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-grid dash-grid-cols-1 dash-gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="dash-card dash-p-3">
              <div className="dash-aspect-video dash-rounded-xl dash-bg-muted" />
              <div className="dash-mt-3 dash-space-y-2">
                <div className="dash-h-4 dash-rounded dash-bg-muted" />
                <div className="dash-h-3 dash-w-2/3 dash-rounded dash-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : displayVideos.length === 0 ? (
        <div className="dash-card dash-p-5 dash-text-center">
          <p className="dash-text-muted-foreground">No videos found matching your search.</p>
        </div>
      ) : (
        <div className="dash-grid dash-grid-cols-1 dash-gap-4">
          {displayVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="dash-video-card"
            >
              <div className="dash-video-card-thumb">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="dash-w-full dash-h-full dash-object-cover"
                  style={{ transition: 'transform 0.3s' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=640' }}
                />
                <div className="dash-video-card-thumb-overlay" />
                <div className="dash-video-card-duration">
                  <Clock style={{ width: 12, height: 12 }} />
                  {video.duration}
                </div>
              </div>
              <div className="dash-video-card-body">
                <h3 className="dash-video-card-title">{video.title}</h3>
                <p className="dash-text-xs dash-text-muted-foreground">{video.creator}</p>
                <div className="dash-mt-3 dash-flex dash-items-center dash-justify-between">
                  <span className="dash-flex dash-items-center dash-gap-1 dash-rounded-lg dash-bg-primary/10 dash-px-2 dash-py-0.5 dash-text-xs dash-font-bold dash-text-primary">
                    <Star className="dash-size-3" /> +${video.reward}
                  </span>
                  <button className="dash-rounded-lg dash-bg-primary dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-primary-foreground dash-transition-transform dash-hover:scale-105 dash-active:scale-95">
                    Watch
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
