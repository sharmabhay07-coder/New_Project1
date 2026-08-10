import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { VideoCard } from './video-card'
import './video-rail.css'

export function VideoRail({
  title,
  subtitle,
  videos,
  grid = false,
}) {
  return (
    <section>
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">{title}</h2>
          {subtitle && <p className="dash-section-subtitle">{subtitle}</p>}
        </div>
        <button className="dash-section-action">
          View all <ChevronRight className="dash-size-4" />
        </button>
      </div>

      {grid ? (
        <div className="dash-video-rail-grid">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="dash-video-rail-scroll">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              className="dash-video-rail-scroll-item"
            />
          ))}
        </div>
      )}
    </section>
  )
}
