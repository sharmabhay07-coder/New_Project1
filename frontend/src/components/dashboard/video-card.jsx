import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BadgeCheck, Eye, Clock, Coins, Check, Bookmark } from 'lucide-react'
import './video-card.css'

const difficultyStyles = {
  Easy: 'dash-badge-primary',
  Medium: 'dash-badge-warning',
  Hard: 'dash-badge-danger',
}

export function VideoCard({ video, className, style }) {
  const [saved, setSaved] = useState(false)

  const btnClass =
    video.completed
      ? 'dash-video-card-btn-secondary'
      : video.progress > 0
        ? 'dash-video-card-btn-accent'
        : 'dash-video-card-btn-primary'

  const showProgress = typeof video.progress === 'number' && video.progress > 0 && !video.completed

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={'dash-video-card ' + (className || '')}
      style={style}
    >
      <div className="dash-video-card-thumb">
        <img
          src={video.thumbnail || '/placeholder.svg'}
          alt={video.title}
          className="dash-w-full dash-h-full dash-object-cover"
          style={{ transition: 'transform 0.5s ease' }}
        />
        <div className="dash-video-card-thumb-overlay" />

        <div className="dash-video-card-reward">
          <Coins style={{ width: 14, height: 14 }} />+₹{video.reward.toFixed(2)}
        </div>

        <button
          aria-label={saved ? 'Remove bookmark' : 'Save for later'}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="dash-video-card-bookmark"
        >
          <Bookmark className={saved ? 'fill-current dash-text-primary' : ''} style={{ width: 16, height: 16 }} />
        </button>

        <div className="dash-video-card-duration">
          <Clock style={{ width: 12, height: 12 }} />
          {video.duration}
        </div>

        {video.completed && (
          <div className="dash-video-card-badge-earned">
            <Check style={{ width: 12, height: 12 }} /> Earned
          </div>
        )}

        <button
          aria-label={'Watch ' + video.title}
          className="dash-video-card-play"
        >
          <motion.span
            initial={false}
            whileHover={{ scale: 1.08 }}
            className="dash-video-card-play-btn"
          >
            <Play style={{ width: 24, height: 24 }} fill="currentColor" />
          </motion.span>
        </button>

        {showProgress && (
          <div className="dash-video-card-progress">
            <div className="dash-video-card-progress-bar" style={{ width: `${video.progress}%` }} />
          </div>
        )}
      </div>

      <div className="dash-video-card-body">
        {(video.category || video.difficulty) && (
          <div className="dash-video-card-meta">
            {video.category && (
              <span className="dash-video-card-category">
                {video.category}
              </span>
            )}
            {video.difficulty && (
              <span
                className={
                  'dash-video-card-difficulty ' + (difficultyStyles[video.difficulty] || '')
                }
              >
                {video.difficulty}
              </span>
            )}
          </div>
        )}

        <h3 className="dash-video-card-title">
          {video.title}
        </h3>

        <div className="dash-video-card-footer">
          <span className="dash-flex dash-items-center dash-gap-1">
            <span className="dash-video-card-avatar">
              {video.creator?.slice(0, 1) || '?'}
            </span>
            <span className="dash-truncate">{video.creator || 'Unknown'}</span>
            {video.verified && <BadgeCheck style={{ width: 14, height: 14 }} className="dash-text-accent" />}
          </span>
          {video.views && (
            <span className="dash-flex dash-items-center dash-gap-1">
              <Eye style={{ width: 14, height: 14 }} />
              {video.views}
            </span>
          )}
        </div>

        <button className={'dash-video-card-btn ' + btnClass}>
          {video.completed ? (
            'Watch Again'
          ) : video.progress > 0 ? (
            'Continue Watching'
          ) : (
            <>
              <Play style={{ width: 16, height: 16 }} fill="currentColor" /> Watch &amp; Earn
            </>
          )}
        </button>
      </div>
    </motion.article>
  )
}
