import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { VideoCard } from './video-card'

export function VideoRail({
  title,
  subtitle,
  videos,
  grid = false,
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          View all <ChevronRight className="size-4" />
        </button>
      </div>

      {grid ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              className="w-[280px] shrink-0 snap-start sm:w-[320px]"
            />
          ))}
        </div>
      )}
    </section>
  )
}
