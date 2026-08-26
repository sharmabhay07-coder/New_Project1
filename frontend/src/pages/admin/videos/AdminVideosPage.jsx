import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  approveAdminVideo,
  getAdminVideos,
  rejectAdminVideo,
} from '@/lib/api/videoApi'
import useAuth from '@/hooks/useAuth'

import AdminTable from '../components/AdminTable'

const columns = [
  { key: 'video', label: 'Video' },
  { key: 'user', label: 'User' },
  { key: 'status', label: 'Status' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const actionButtonClass =
  'dash-rounded-lg dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-white dash-disabled:opacity-60 dash-transition-transform dash-hover:scale-105 dash-active:scale-95'

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getStatusBadgeClass = (status) => {
  if (status === 'pending') return 'dash-badge dash-badge-warning'
  if (status === 'approved') return 'dash-badge dash-badge-accent'
  if (status === 'rejected') return 'dash-badge dash-badge-danger'

  return 'dash-badge dash-badge-primary'
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')

  const { token } = useAuth()

  const fetchVideos = useCallback(
    async ({ showLoading = true } = {}) => {
      if (!token) {
        setVideos([])
        setLoading(false)
        return
      }

      if (showLoading) setLoading(true)
      setError('')

      try {
        const res = await getAdminVideos(token, statusFilter)
        setVideos(res.data?.videos || [])
      } catch (err) {
        console.error('Failed to fetch admin videos:', err)
        setVideos([])
        setError(err.message || 'Failed to load videos')
      } finally {
        setLoading(false)
      }
    },
    [statusFilter, token]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideos()
  }, [fetchVideos])

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return videos.filter((video) => {
      const status = video.status?.toLowerCase() || ''
      const matchesStatus = !statusFilter || status === statusFilter

      if (!matchesStatus) return false
      if (!query) return true

      return [
        video.title,
        video.description,
        video.uploadedBy?.name,
        video.uploadedBy?.email,
        status,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    })
  }, [searchQuery, statusFilter, videos])

  const rows = useMemo(
    () =>
      filteredVideos.map((video) => {
        const status = video.status?.toLowerCase() || 'pending'

        return {
          id: video._id,
          statusValue: status,
          video: (
            <div className="dash-flex dash-items-center dash-gap-3 dash-min-w-0">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="dash-size-12 dash-rounded-lg dash-object-cover"
                />
              ) : (
                <div className="dash-size-12 dash-rounded-lg dash-bg-muted" />
              )}
              <div className="dash-min-w-0 dash-space-y-1">
                <p className="dash-m-0 dash-font-semibold dash-text-foreground dash-truncate">
                  {video.title || 'Untitled video'}
                </p>
                <p className="dash-m-0 dash-text-xs dash-text-muted-foreground dash-truncate">
                  {video.description || formatDuration(video.duration)}
                </p>
              </div>
            </div>
          ),
          user: (
            <div className="dash-space-y-1">
              <p className="dash-m-0 dash-font-medium dash-text-foreground">
                {video.uploadedBy?.name || 'Unknown user'}
              </p>
              <p className="dash-m-0 dash-text-xs dash-text-muted-foreground">
                {video.uploadedBy?.email || 'No email'}
              </p>
            </div>
          ),
          status: (
            <span className={getStatusBadgeClass(status)}>
              {status}
            </span>
          ),
        }
      }),
    [filteredVideos]
  )

  const handleVideoAction = async (row, action) => {
    if (!token || !row.id) return

    setActionId(`${action}:${row.id}`)
    setError('')

    try {
      if (action === 'approve') {
        await approveAdminVideo(token, row.id)
      } else {
        await rejectAdminVideo(token, row.id)
      }

      await fetchVideos({ showLoading: false })
    } catch (err) {
      console.error(`Failed to ${action} video:`, err)
      setError(err.message || `Failed to ${action} video`)
    } finally {
      setActionId('')
    }
  }

  return (
    <div className="dash-page dash-space-y-6">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">
          Videos
        </h1>
      </div>

      <div className="dash-flex dash-gap-3">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="dash-rounded-2xl dash-border dash-border-destructive dash-bg-background dash-p-4 dash-text-sm dash-text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="dash-card dash-p-6 dash-space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="dash-flex dash-items-center dash-gap-3 dash-animate-pulse"
            >
              <div className="dash-size-12 dash-rounded-lg dash-bg-muted" />
              <div className="dash-flex-1 dash-space-y-2">
                <div className="dash-h-4 dash-w-64 dash-rounded-lg dash-bg-muted" />
                <div className="dash-h-3 dash-w-40 dash-rounded-lg dash-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="dash-card dash-p-5" style={{ textAlign: 'center' }}>
          <p className="dash-m-0 dash-text-sm dash-text-muted-foreground">
            No videos found
          </p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={rows}
          emptyMessage="No videos found"
          actions={[
            {
              key: 'approve',
              label: 'Approve',
              className: `${actionButtonClass} dash-bg-success`,
              isVisible: (row) => row.statusValue === 'pending',
              isDisabled: () => Boolean(actionId),
              onClick: (row) => handleVideoAction(row, 'approve'),
            },
            {
              key: 'reject',
              label: 'Reject',
              className: `${actionButtonClass} dash-bg-destructive`,
              isVisible: (row) => row.statusValue === 'pending',
              isDisabled: () => Boolean(actionId),
              onClick: (row) => handleVideoAction(row, 'reject'),
            },
          ]}
        />
      )}
    </div>
  )
}
