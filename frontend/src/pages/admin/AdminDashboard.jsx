import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react'

import { getAdminVideos } from '@/lib/api/videoApi'
import { getAdminUsers } from '@/lib/api/userApi'
import useAuth from '@/hooks/useAuth'

const DASH = '\u2014'

const emptyStats = {
    pendingReview: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalUsers: null,
}

const isToday = (value) => {
    if (!value) return false

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false

    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    return date >= start && date < end
}

const adminNavLinkClass = ({ isActive }) =>
    [
        'dash-rounded-lg',
        'dash-border',
        'dash-px-3',
        'dash-py-1.5',
        'dash-text-sm',
        'dash-font-semibold',
        'dash-transition-colors',
        isActive
            ? 'dash-border-transparent dash-bg-primary dash-text-primary-foreground'
            : 'dash-border-border dash-bg-transparent dash-text-muted-foreground dash-hover:bg-secondary dash-hover:text-foreground',
    ].join(' ')

export default function AdminDashboard() {
    const [stats, setStats] = useState(emptyStats)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { token } = useAuth()

    useEffect(() => {
        const loadStats = async () => {
            if (!token) {
                setStats(emptyStats)
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')

            try {
                const [videosRes, usersRes] = await Promise.all([
                    getAdminVideos(token),
                    getAdminUsers(token),
                ])

                const videos = videosRes.data?.videos || []
                const users = usersRes.data?.users || []

                setStats({
                    pendingReview: videos.filter(
                        (video) =>
                            video.status?.toLowerCase() === 'pending'
                    ).length,
                    approvedToday: videos.filter(
                        (video) =>
                            video.status?.toLowerCase() === 'approved' &&
                            isToday(video.updatedAt)
                    ).length,
                    rejectedToday: videos.filter(
                        (video) =>
                            video.status?.toLowerCase() === 'rejected' &&
                            isToday(video.updatedAt)
                    ).length,
                    totalUsers: users.length,
                })
            } catch (err) {
                console.error('Failed to fetch admin dashboard stats:', err)
                setStats(emptyStats)
                setError(err.message || 'Failed to load admin stats')
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [token])

    return (
        <div className="dash-page dash-space-y-6">

            {error ? (
                <div className="dash-rounded-2xl dash-border dash-border-destructive dash-bg-background dash-p-4 dash-text-sm dash-text-destructive">
                    {error}
                </div>
            ) : null}

            <div className="dash-grid dash-grid-cols-1 dash-gap-4 dash-sm:grid-cols-2 dash-lg:grid-cols-4">
                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <Clock className="dash-size-5 dash-text-warning" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? DASH : stats.pendingReview}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">
                        Pending review
                    </p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <CheckCircle className="dash-size-5 dash-text-primary" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? DASH : stats.approvedToday}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">
                        Approved today
                    </p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <XCircle className="dash-size-5 dash-text-destructive" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? DASH : stats.rejectedToday}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">
                        Rejected today
                    </p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <Users className="dash-size-5 dash-text-accent" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading || stats.totalUsers === null ? DASH : stats.totalUsers}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">
                        Total users
                    </p>
                </div>
            </div>
        </div>
    )
}