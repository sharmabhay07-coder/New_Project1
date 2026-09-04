import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { startVideoWatch, completeVideoReward } from '@/lib/api/videoApi'
import useAuth from '@/hooks/useAuth'
import './watch-video-modal.css'

export default function WatchVideoModal({ video, onClose, onRewardClaimed }) {
  const { token } = useAuth()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [rewardStatus, setRewardStatus] = useState('idle') // idle, loading, success, already_claimed, error
  const [message, setMessage] = useState('')
  const [isTrackingStarted, setIsTrackingStarted] = useState(false)
  
  const videoRef = useRef(null)
  const maxTimeWatched = useRef(0)
  const rewardClaimedRef = useRef(false)
  const isCompletedRef = useRef(video.completed)

  // Start playback automatically on mount and start backend tracking
  useEffect(() => {
    const initWatch = async () => {
      try {
        if (!isCompletedRef.current) {
          await startVideoWatch(token, video.id || video._id)
        }
        setIsTrackingStarted(true)
      } catch (err) {
        console.error('Failed to start tracking:', err)
        setError('Failed to start tracking session. Please refresh.')
      }
    }
    
    if (token && video && !isTrackingStarted) {
      initWatch()
    }
  }, [token, video, isTrackingStarted])

  useEffect(() => {
    if (videoRef.current && isTrackingStarted) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented:', err)
            setIsPlaying(false)
          })
      }
    }
  }, [video, isTrackingStarted])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = (e) => {
    const vid = e.target
    const currentTime = vid.currentTime
    const duration = vid.duration || 1
    
    if (isCompletedRef.current) {
      // If completed, let them seek freely
      maxTimeWatched.current = currentTime
    } else {
      // Strict Anti-Seek
      if (currentTime > maxTimeWatched.current + 0.75) {
        vid.currentTime = maxTimeWatched.current
      } else {
        maxTimeWatched.current = Math.max(maxTimeWatched.current, currentTime)
      }
    }

    const currentProgress = (maxTimeWatched.current / duration) * 100
    setProgress(currentProgress)

    // Trigger reward at 90% visually
    if (currentProgress >= 90 && !rewardClaimedRef.current && !isCompletedRef.current) {
      claimReward()
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (!rewardClaimedRef.current && !isCompletedRef.current) {
      claimReward()
    }
  }

  const claimReward = async () => {
    rewardClaimedRef.current = true
    setRewardStatus('loading')
    
    try {
      const res = await completeVideoReward(token, video.id || video._id)
      setRewardStatus('success')
      setMessage(`+₹${res.reward || video.reward} Earned!`)
      isCompletedRef.current = true // Allow seeking now!
      onRewardClaimed?.(res.reward || video.reward)
    } catch (err) {
      const errMsg = err.message || ''
      if (errMsg.toLowerCase().includes('already claimed')) {
        setRewardStatus('already_claimed')
        setMessage('Reward already claimed')
        isCompletedRef.current = true // Allow seeking since it was already claimed!
        onRewardClaimed?.(0) // Just update local state to completed, no new earnings
      } else {
        setRewardStatus('error')
        setMessage(errMsg || 'Failed to claim reward. Try again.')
        rewardClaimedRef.current = false // Allow retry
      }
    }
  }

  const handleVideoError = () => {
    setError('Video file not found or could not be loaded.')
  }

  return (
    <AnimatePresence>
      <div className="watch-modal-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="watch-modal-container"
        >
          <button className="watch-modal-close" onClick={onClose} aria-label="Close video">
            <X size={24} />
          </button>

          {error ? (
            <div className="watch-modal-error">
              <AlertTriangle size={48} className="dash-text-warning dash-mb-4" />
              <h3>Oops!</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="watch-modal-player-wrapper" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={video.secure_url}
                poster={video.thumbnail || undefined}
                className="watch-modal-video"
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
                onContextMenu={(e) => e.preventDefault()}
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleTimeUpdate}
                onEnded={handleEnded}
                onError={handleVideoError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play Affordance if autoplay fails or paused */}
              {!isPlaying && (
                <div className="watch-modal-center-play">
                  <Play size={64} fill="white" color="white" />
                </div>
              )}

              {/* Custom Control Bar */}
              <div className="watch-modal-controls" onClick={(e) => e.stopPropagation()}>
                <button className="watch-modal-play-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <div className="watch-modal-progress-bar">
                  <div 
                    className="watch-modal-progress-fill" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reward Status Toast */}
          <AnimatePresence>
            {rewardStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`watch-modal-reward-toast status-${rewardStatus}`}
              >
                {rewardStatus === 'loading' && <Loader2 className="dash-animate-spin" size={18} />}
                {rewardStatus === 'success' && <CheckCircle size={18} />}
                {rewardStatus === 'already_claimed' && <CheckCircle size={18} />}
                {rewardStatus === 'error' && <AlertTriangle size={18} />}
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
