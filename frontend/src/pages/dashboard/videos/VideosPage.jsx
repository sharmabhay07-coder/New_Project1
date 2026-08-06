import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaySquare, Star, Clock, CheckCircle, Filter } from 'lucide-react'
import { getVideos } from '@/lib/api/videoApi'
import { featuredVideos as mockVideos } from '@/lib/mock-data'

const CATEGORIES = ['All', 'Finance', 'Technology', 'Travel', 'Fitness', 'Gaming', 'Cooking']

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
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
          setVideos(mapped.length > 0 ? mapped : mockVideos)
        } else {
          setVideos(mockVideos)
        }
      } catch {
        setVideos(mockVideos)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const filtered = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory)

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Watch & Earn</h1>
        <p className="mt-1 text-sm text-muted-foreground">Watch videos and earn real rewards for every minute.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Videos Available', value: videos.length, icon: PlaySquare, color: 'text-primary' },
          { label: 'Avg Reward', value: `$${videos.length ? (videos.reduce((a,v) => a + (v.reward||0), 0) / videos.length).toFixed(2) : '0.00'}`, icon: Star, color: 'text-warning' },
          { label: 'Total Earned Today', value: '$0.00', icon: CheckCircle, color: 'text-success' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <stat.icon className={`size-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="size-4 shrink-0 text-muted-foreground" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-soft-primary'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-3">
              <div className="aspect-video rounded-xl bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-4 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-soft-lg cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=640' }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="grid size-12 place-items-center rounded-full bg-white/90">
                    <PlaySquare className="size-6 text-primary" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                  {video.duration}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">{video.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{video.creator}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    <Star className="size-3" /> +${video.reward}
                  </span>
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95">
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
