import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BadgeCheck, Eye, Clock, Coins, Check, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const difficultyStyles = {
  Easy: 'bg-primary/12 text-primary',
  Medium: 'bg-warning/15 text-warning',
  Hard: 'bg-destructive/12 text-destructive',
}

export function VideoCard({ video, className }) {
  const [saved, setSaved] = useState(false)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-soft-lg',
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail || '/placeholder.svg'}
          alt={video.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        {/* Reward badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-soft">
          <Coins className="size-3.5" />+{video.reward.toFixed(2)}
        </div>

        {/* Bookmark */}
        <button
          aria-label={saved ? 'Remove bookmark' : 'Save for later'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <Bookmark className={cn('size-4', saved && 'fill-current text-primary')} />
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
          <Clock className="size-3" />
          {video.duration}
        </div>

        {video.completed && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
            <Check className="size-3" /> Earned
          </div>
        )}

        {/* Play overlay */}
        <button
          aria-label={`Watch ${video.title}`}
          className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <motion.span
            initial={false}
            whileHover={{ scale: 1.08 }}
            className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-primary"
          >
            <Play className="size-6 translate-x-0.5 fill-current" />
          </motion.span>
        </button>

        {/* In-progress bar */}
        {video.progress > 0 && !video.completed && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
            <div className="h-full bg-accent" style={{ width: `${video.progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {video.category}
          </span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-bold',
              difficultyStyles[video.difficulty],
            )}
          >
            {video.difficulty}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-pretty">
          {video.title}
        </h3>

        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="grid size-5 place-items-center rounded-full bg-secondary text-[9px] font-bold text-foreground">
              {video.creator.slice(0, 1)}
            </span>
            <span className="truncate">{video.creator}</span>
            {video.verified && <BadgeCheck className="size-3.5 text-accent" />}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {video.views}
          </span>
        </div>

        <button
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition-transform hover:scale-[1.02]',
            video.completed
              ? 'bg-secondary text-muted-foreground'
              : video.progress > 0
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground',
          )}
        >
          {video.completed ? (
            'Watch Again'
          ) : video.progress > 0 ? (
            'Continue Watching'
          ) : (
            <>
              <Play className="size-4 fill-current" /> Watch &amp; Earn
            </>
          )}
        </button>
      </div>
    </motion.article>
  )
}

