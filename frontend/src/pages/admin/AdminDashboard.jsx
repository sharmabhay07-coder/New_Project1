import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'  
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react'

/**
 * DESIGN PASS ONLY — the stat numbers below are not wired to a real
 * endpoint yet (no admin stats API exists). loading state renders '—'
 * until that endpoint is built, rather than showing fake numbers as if
 * they were real.
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: replace with real call once an admin stats endpoint exists
        // e.g. getAdminStats(token).then(res => setStats(res.data)).finally(() => setLoading(false))
        setLoading(false)
    }, [])

    const pending = stats?.pendingVideos
    const approvedToday = stats?.approvedToday
    const rejectedToday = stats?.rejectedToday
    const totalUsers = stats?.totalUsers

    return (
        <div className="dash-page dash-space-y-6">

            <header className="dash-flex dash-h-16 dash-items-center dash-justify-between dash-px-4 dash-md:px-6 dash-w-full dash-bg-card dash-border dash-border-border dash-rounded-xl">
                <div className="dash-flex dash-items-center dash-gap-2">
                    <div className="dash-sidebar-logo">
                        <h1 className="dash-logo-text">
                            Earn <span>Hub</span>
                        </h1>
                    </div>
                    <span className="dash-text-xs dash-font-semibold dash-text-muted-foreground dash-ml-1">
                        Admin
                    </span>
                </div>

                {/* <nav className="dash-header-nav">
                    <NavLink to="/admin" end>Dashboard</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>
                    <NavLink to="/admin/videos">Videos</NavLink>
                </nav> */}
            </header>

            <div className="dash-grid dash-grid-cols-1 dash-sm:grid-cols-2 dash-lg:grid-cols-4 dash-gap-4">
                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <Clock className="dash-size-5 dash-text-warning" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? '—' : pending ?? '—'}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">Pending review</p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <CheckCircle className="dash-size-5 dash-text-primary" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? '—' : approvedToday ?? '—'}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">Approved today</p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <XCircle className="dash-size-5 dash-text-destructive" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? '—' : rejectedToday ?? '—'}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">Rejected today</p>
                </div>

                <div className="dash-card dash-p-6 dash-shadow-soft">
                    <Users className="dash-size-5 dash-text-accent" />
                    <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">
                        {loading ? '—' : totalUsers ?? '—'}
                    </p>
                    <p className="dash-text-xs dash-text-muted-foreground">Total users</p>
                </div>
            </div>

        </div>
    )
}