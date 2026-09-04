import { AnimatePresence, motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const resolveVideoUrl = (url) => {
  if (!url) return ''

  if (/^(https?:)?\/\//i.test(url) || /^(blob|data):/i.test(url)) {
    return url
  }

  const uploadBase = API_BASE.replace(/\/api\/?$/, '').replace(/\/+$/, '')
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${uploadBase}${normalizedPath}`
}

const formatDuration = (duration) => {
  if (duration === undefined || duration === null || duration === '') {
    return 'Unknown duration'
  }

  const totalSeconds = Number(duration)

  if (Number.isNaN(totalSeconds)) {
    return duration
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function AdminConfirmModal({
  video,
  action,
  isOpen,
  onConfirm,
  onCancel,
}) {
  const isReject = action === 'reject'
  const confirmLabel = isReject ? 'Reject' : 'Approve'
  const confirmColorClass = isReject ? 'dash-bg-destructive' : 'dash-bg-success'
  const videoSrc = resolveVideoUrl(video?.secure_url)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-p-4"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="dash-w-full dash-max-w-2xl dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-6 dash-shadow-soft-lg"
          >
            <div className="dash-space-y-4">
              <div className="dash-aspect-video dash-overflow-hidden dash-rounded-2xl dash-bg-muted">
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    controls
                    className="dash-w-full dash-h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="dash-flex dash-h-full dash-items-center dash-justify-center dash-p-4 dash-text-sm dash-text-muted-foreground">
                    Video preview unavailable
                  </div>
                )}
              </div>

              <div className="dash-space-y-3">
                <div className="dash-space-y-1">
                  <h2 className="dash-m-0 dash-text-lg dash-font-bold dash-text-foreground">
                    {video?.title || 'Untitled video'}
                  </h2>
                  <p className="dash-m-0 dash-text-sm dash-text-muted-foreground dash-leading-1-5">
                    {video?.description || 'No description provided.'}
                  </p>
                </div>

                <div className="dash-grid dash-grid-cols-1 dash-gap-3 dash-sm:grid-cols-2">
                  <div className="dash-rounded-xl dash-border dash-border-border dash-p-3">
                    <p className="dash-m-0 dash-text-xs dash-font-semibold dash-text-muted-foreground">
                      Uploaded by
                    </p>
                    <p className="dash-m-0 dash-text-sm dash-font-semibold dash-text-foreground">
                      {video?.uploadedBy?.name || 'Unknown user'}
                    </p>
                    <p className="dash-m-0 dash-text-xs dash-text-muted-foreground">
                      {video?.uploadedBy?.email || 'No email'}
                    </p>
                  </div>

                  <div className="dash-rounded-xl dash-border dash-border-border dash-p-3">
                    <p className="dash-m-0 dash-text-xs dash-font-semibold dash-text-muted-foreground">
                      Duration
                    </p>
                    <p className="dash-m-0 dash-text-sm dash-font-semibold dash-text-foreground">
                      {formatDuration(video?.duration)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dash-flex dash-gap-3 dash-pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="dash-flex-1 dash-rounded-xl dash-border dash-border-border dash-py-2.5 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`dash-flex-1 dash-rounded-lg dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-white dash-disabled:opacity-60 dash-transition-transform dash-hover:scale-105 dash-active:scale-95 ${confirmColorClass}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
