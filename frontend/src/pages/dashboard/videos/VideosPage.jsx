import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  PlaySquare,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
} from 'lucide-react'

import { getVideos, completeVideoReward, startVideoWatch } from '@/lib/api/videoApi'
import useAuth from '@/hooks/useAuth'

import DashboardMiniProfile from '../components/dashboard-mini-profile'
import PlansPromoPanel from '../components/plans-promo-panel'
import VideoUploadForm from './video-upload-form'

import './VideosPage.css'

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, '')

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState(null)
  const [videoErrors, setVideoErrors] = useState({})
  const [todayEarned, setTodayEarned] = useState(0)

  // Mobile drawer states
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)

  // Track playback time to prevent seeking/skipping
  const timeTracker = useRef({})
  const trackingStarted = useRef({})
  const rewardClaimed = useRef({})

  const [searchParams] = useSearchParams()
  const { token } = useAuth()

  const searchQuery =
    searchParams.get('search')?.toLowerCase() || ''

  const fetchVideos = async () => {
    try {
      if (!token) return
      setLoading(true)

      const res = await getVideos(token)

      const mapped =
        res.data?.videos?.map((v) => ({
          id: v._id,
          title: v.title,
          creator: v.uploadedBy?.name || 'Admin',

          thumbnail: v.thumbnail || '',

          secure_url: v.secure_url
            ? v.secure_url.startsWith('http')
              ? v.secure_url
              : `${BACKEND_BASE}${v.secure_url.startsWith('/') ? '' : '/'}${v.secure_url}`
            : '',

          reward: Number(v.reward) || 5,

          durationSeconds: Number(v.duration) || 0,

          duration: `${Math.floor(
            (Number(v.duration) || 300) / 60
          )}:${((Number(v.duration) || 300) % 60)
            .toString()
            .padStart(2, '0')}`,

          completed: Boolean(v.completed),
          progress: Number(v.progress) || 0,
        })) || []

      setVideos(mapped)
      setVideoErrors({})
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [token])

  const searchFiltered = searchQuery
    ? videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery) ||
          video.creator.toLowerCase().includes(searchQuery)
      )
    : videos

  const displayVideos = searchFiltered

  const avgReward = videos.length
    ? (
        videos.reduce(
          (total, video) => total + (video.reward || 0),
          0
        ) / videos.length
      ).toFixed(2)
    : '0.00'

  useEffect(() => {
    const scrollContainer = document.querySelector('.videos-col-scroll');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoEl = entry.target;
          
          // Pause if scrolling out of view
          if (entry.intersectionRatio < 0.4) {
            if (!videoEl.paused) {
              videoEl.pause();
            }
          }
          // Auto-play if snapping into view
          else if (entry.intersectionRatio > 0.6) {
            if (videoEl.paused) {
              videoEl.muted = false;
              videoEl.play().catch((err) => {
                if (err.name === 'NotAllowedError') {
                  videoEl.muted = true;
                  videoEl.play().catch(() => {});
                }
              });
            }
          }
        });
      },
      {
        root: scrollContainer,
        threshold: [0.3, 0.7] // Fire when passing 30% and 70% visibility
      }
    );

    const attach = () => {
      const videoElements = document.querySelectorAll('.videos-col-scroll video');
      if (videoElements.length > 0) {
        videoElements.forEach((el) => observer.observe(el));
      } else if (displayVideos.length > 0) {
        setTimeout(attach, 100);
      }
    };
    
    attach();

    return () => {
      observer.disconnect();
    };
  }, [displayVideos]);

  const handlePlay = async (videoId) => {
    setPlayingId(videoId)
    
    // Auto-pause any other playing videos
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((vid) => {
      if (vid.id !== `vid-${videoId}` && !vid.paused) {
        vid.pause();
      }
    });

    const video = videos.find(v => v.id === videoId);
    if (video && !video.completed && !trackingStarted.current[videoId]) {
      trackingStarted.current[videoId] = true;
      try {
        await startVideoWatch(token, videoId);
      } catch (err) {
        console.error('Failed to start tracking', err);
      }
    }
  }

  const handlePause = (videoId) => {
    setPlayingId((prev) => (prev === videoId ? null : prev))
  }

  const handleVideoEnded = async (video, isNaturalEnd = false) => {
    if (isNaturalEnd) {
      setPlayingId((prev) => (prev === video.id ? null : prev))
    }

    // Only claim if not already completed
    if (video.completed) return;
    
    // Set this flag immediately in case called twice quickly
    rewardClaimed.current[video.id] = true;

    try {
      const res = await completeVideoReward(token, video.id)

      // Update local state to show 'Earned' immediately
      setVideos(prev => prev.map(v =>
        v.id === video.id ? { ...v, completed: true } : v
      ))

      // Update total earned today dynamically
      setTodayEarned(prev => prev + (res?.reward || video.reward || 0))
    } catch (error) {
      console.error('Failed to claim reward:', error)
      // Reset so they can try again if it failed
      rewardClaimed.current[video.id] = false;
    }
  }

  const handleVideoError = (videoId) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: true }))
  }

  const handleRetry = (videoId) => {
    setVideoErrors((prev) => {
      const next = { ...prev }
      delete next[videoId]
      return next
    })
  }

  const handleTimeUpdate = (e, video) => {
    if (video.completed) return;

    const vid = e.target;
    
    if (timeTracker.current[video.id] === undefined) {
      timeTracker.current[video.id] = 0;
    }

    // Strict Anti-Seek
    if (vid.currentTime > timeTracker.current[video.id] + 0.75) {
      vid.currentTime = timeTracker.current[video.id];
    } else {
      timeTracker.current[video.id] = Math.max(timeTracker.current[video.id], vid.currentTime);
    }

    // Trigger exactly like modal to ensure 90% is met without race condition at end
    const duration = vid.duration || 1;
    const currentProgress = (timeTracker.current[video.id] / duration) * 100;
    if (currentProgress >= 90 && !rewardClaimed.current[video.id]) {
       rewardClaimed.current[video.id] = true;
       handleVideoEnded(video);
    }
  }

  return (
    <div className="videos-page-grid">

      {/* ───── MOBILE OVERLAY ───── */}
      {(leftOpen || rightOpen) && (
        <div 
          className="dash-mobile-overlay" 
          onClick={() => { setLeftOpen(false); setRightOpen(false); }} 
        />
      )}

      {/* ───── MOBILE TOGGLES (<=1024px only) ───── */}
      <div className="dash-mobile-toggles">
        <button className="dash-mobile-toggle-btn" onClick={() => { setLeftOpen(true); setRightOpen(false); }}>
          Profile & Stats
        </button>
        <button className="dash-mobile-toggle-btn" onClick={() => { setRightOpen(true); setLeftOpen(false); }}>
          Upload & Plans
        </button>
      </div>

      {/* ───── LEFT SIDEBAR ───── */}
      <div className={`videos-col-fixed videos-col-left ${leftOpen ? 'open' : ''}`}>
        <div className="dash-flex dash-flex-col dash-gap-4">
          <DashboardMiniProfile />

          <div className="videos-stats-grid">
            {[
              {
                label: 'Videos Available',
                value: videos.length,
                icon: PlaySquare,
                color: 'dash-text-primary',
              },
              {
                label: 'Avg Reward',
                value: `₹${avgReward}`,
                icon: Star,
                color: 'dash-text-warning',
              },
              {
                label: 'Total Earned Today',
                value: `₹${todayEarned.toFixed(2)}`,
                icon: CheckCircle,
                color: 'dash-text-success',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="dash-card dash-p-6 dash-shadow-soft"
              >
                <div className="dash-flex dash-items-center dash-gap-2">
                  <stat.icon
                    className={'dash-size-4 ' + stat.color}
                  />

                  <span className="dash-text-xs dash-text-muted-foreground">
                    {stat.label}
                  </span>
                </div>

                <p className="dash-mt-1 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── MIDDLE — VIDEO FEED ───── */}
      <div className="videos-col-scroll">
        <div className="dash-page">

          {loading ? (
            <div className="dash-grid dash-grid-cols-1 dash-gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="dash-card dash-p-3 dash-animate-pulse"
                  style={{
                    maxWidth: '420px',
                    margin: '0 auto',
                    width: '100%'
                  }}
                >
                  <div 
                    className="dash-rounded-xl dash-bg-muted" 
                    style={{ aspectRatio: '9/16' }}
                  />

                  <div className="dash-mt-3 dash-space-y-2">
                    <div className="dash-h-4 dash-rounded dash-bg-muted" />
                    <div className="dash-h-3 dash-w-2/3 dash-rounded dash-bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayVideos.length === 0 ? (
            <div className="dash-card dash-p-5 dash-text-center">
              <p className="dash-text-muted-foreground">
                No videos found. Upload a video to get started!
              </p>
            </div>
          ) : (
            <div className="dash-grid dash-grid-cols-1 dash-gap-4">

              {displayVideos.map((video, i) => (
                <motion.article
                  key={video.id}
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: i * 0.04,
                  }}
                  className="dash-video-card"
                  style={{
                    maxWidth: '420px',
                    margin: '0 auto',
                    width: '100%',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 24px -8px rgba(0,0,0,0.2)',
                    scrollSnapAlign: 'start',
                    scrollMarginTop: '16px'
                  }}
                >

                  {/* ── VIDEO PLAYER ── */}
                  <div
                    className="dash-video-card-thumb"
                    style={{
                      aspectRatio: '9/16',
                      position: 'relative',
                      background: '#000',
                    }}
                  >

                    {videoErrors[video.id] ? (
                      /* Video file missing / failed to load */
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#999',
                        background: '#1a1a1a',
                      }}>
                        <AlertTriangle style={{ width: 32, height: 32, color: '#f59e0b' }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          Video file not found
                        </span>
                        <span style={{ fontSize: 11, color: '#666' }}>
                          Re-upload this video to fix
                        </span>
                        <button
                          onClick={() => handleRetry(video.id)}
                          style={{
                            marginTop: 4,
                            padding: '6px 16px',
                            borderRadius: 8,
                            border: '1px solid #444',
                            background: '#222',
                            color: '#fff',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : video.secure_url ? (
                      <video
                        id={`vid-${video.id}`}
                        src={video.secure_url}
                        poster={video.thumbnail || undefined}
                        crossOrigin="anonymous"
                        controls
                        controlsList="nofullscreen"
                        disablePictureInPicture
                        playsInline
                        preload="metadata"
                        onPlay={() => handlePlay(video.id)}
                        onPause={() => handlePause(video.id)}
                        onEnded={() => handleVideoEnded(video, true)}
                        onError={() => handleVideoError(video.id)}
                        onTimeUpdate={(e) => handleTimeUpdate(e, video)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          position: 'relative',
                          zIndex: 2,
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          // Native controls are roughly the bottom 60px of the video
                          const isClickOnControls = e.clientY > rect.bottom - 60;
                          
                          // If they clicked the controls, let the browser handle it natively
                          if (isClickOnControls) return;

                          e.target.muted = false;
                          if (e.target.paused) {
                            e.target.play().catch(() => {});
                          } else {
                            e.target.pause();
                          }
                        }}
                      />
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}

                    {/* Custom Center Play Button & Badges */}
                    {playingId !== video.id && !videoErrors[video.id] && (
                      <>
                        <button
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 4,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const videoEl = document.getElementById(`vid-${video.id}`)
                            if (videoEl) {
                              videoEl.muted = false;
                              videoEl.play().catch(() => {})
                            }
                          }}
                        >
                          <motion.div whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                            <Play 
                              style={{ 
                                width: 72, 
                                height: 72, 
                                color: 'white', 
                                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.6))' 
                              }} 
                              fill="white" 
                            />
                          </motion.div>
                        </button>

                        <div
                          className="dash-video-card-reward"
                          style={{ zIndex: 3, pointerEvents: 'none' }}
                        >
                          <Star style={{ width: 14, height: 14 }} />
                          +₹{video.reward.toFixed(2)}
                        </div>

                        <div
                          className="dash-video-card-duration"
                          style={{ zIndex: 3, pointerEvents: 'none' }}
                        >
                          <Clock style={{ width: 12, height: 12 }} />
                          {video.duration}
                        </div>
                      </>
                    )}

                  </div>

                  {/* ── CARD BODY ── */}
                  <div className="dash-video-card-body">

                    <h3 className="dash-video-card-title">
                      {video.title}
                    </h3>

                    <p className="dash-text-xs dash-text-muted-foreground">
                      {video.creator}
                    </p>

                    <div className="dash-mt-3 dash-flex dash-items-center dash-justify-between">

                      <span className="dash-flex dash-items-center dash-gap-1 dash-rounded-lg dash-bg-primary/10 dash-px-2 dash-py-0.5 dash-text-xs dash-font-bold dash-text-primary">
                        <Star className="dash-size-3" />
                        ₹{video.reward}
                      </span>

                      <span className="dash-text-xs dash-text-muted-foreground">
                        {video.completed
                          ? <span style={{color: 'var(--success)'}}>Earned ✓</span>
                          : playingId === video.id
                            ? 'Playing'
                            : 'Ready to watch'}
                      </span>

                    </div>

                  </div>

                </motion.article>
              ))}

            </div>
          )}

        </div>
      </div>

      {/* ───── RIGHT SIDEBAR ───── */}
      <div className={`videos-col-fixed videos-col-right ${rightOpen ? 'open' : ''}`}>
        <VideoUploadForm onUploaded={fetchVideos} />
        <PlansPromoPanel />
      </div>

    </div>
  )
}