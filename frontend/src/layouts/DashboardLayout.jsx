import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  Sun,
  Moon,
  LogOut,
  User,
  Coins,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import LogoutConfirmModal from '../components/dashboard/LogoutConfirmModal'
import './DashboardLayout.css'

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const syncTheme = () => {
      setDark(document.documentElement.classList.contains('dark'))
    }

    syncTheme()
    document.addEventListener('themechange', syncTheme)

    return () => document.removeEventListener('themechange', syncTheme)
  }, [])

  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setDark((d) => !d)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="dash-icon-btn"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default function DashboardLayout() {
  const [userOpen, setUserOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const userName = user?.name || 'User'
  const initials = userName.slice(0, 2).toUpperCase()

  const userRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setUserOpen(false)
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setNotifOpen(false)
      }
    }

    if (userOpen || notifOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userOpen, notifOpen])

  const handleSearch = (e) => {
    e.preventDefault()

    const query = e.target.elements.search.value.trim()

    if (query) {
      navigate(
        `/dashboard/videos?search=${encodeURIComponent(query)}`
      )
    }
  }

  const requestLogout = () => {
    setUserOpen(false)
    setLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    logout()
    setLogoutModalOpen(false)
    navigate('/auth')
  }

  return (
    <div className="dash-shell">

      <div className="dash-main">

        <header className="dash-header">

          <form
            onSubmit={handleSearch}
            className="dash-flex dash-h-16 dash-items-center dash-justify-between dash-px-4 dash-md:px-6 dash-w-full"
          >

            {/* LOGO */}
            <div className="dash-flex dash-items-center dash-gap-2">

              <div
                className="dash-dashboard-logo"
                onClick={() => window.location.reload()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.location.reload()
                  }
                }}
              >
                <h1 className="dash-dashboard-logo-text">
                  Earn <span>Hub</span>
                </h1>
              </div>

            </div>

            {/* HEADER NAVIGATION */}
            <nav className="dash-header-nav">

              <NavLink to="/dashboard" end>
                EarnNow
              </NavLink>

              <NavLink to="/dashboard/plans">
                Plans
              </NavLink>

              <NavLink to="/dashboard/b2b">
                B2B
              </NavLink>

              <NavLink to="/dashboard/videos">
                Videos
              </NavLink>

              <NavLink to="/dashboard/tasks">
                Tasks
              </NavLink>

              <NavLink to="/dashboard/referrals">
                Referral
              </NavLink>

            </nav>

            <div className="dash-flex dash-items-center dash-gap-2 dash-md:gap-3">

              {/* BALANCE */}
              <div className="dash-hidden dash-items-center dash-gap-2 dash-rounded-xl dash-border dash-border-border dash-bg-card dash-px-3 dash-py-2 dash-sm:flex">
                <span className="dash-text-sm dash-font-bold dash-tabular-nums dash-text-primary">
                  ₹0.00
                </span>
              </div>

              {/* SEARCH */}
              <div className="dash-search-wrapper dash-relative dash-flex dash-items-center dash-gap-2 dash-rounded-xl dash-border dash-border-border dash-bg-card dash-px-3 dash-py-2 dash-transition-all dash-w-64 dash-focus-within:border-primary/50 dash-focus-within:shadow-soft">

                <Search className="dash-size-4 dash-text-muted-foreground dash-shrink-0" />

                <input
                  type="search"
                  name="search"
                  placeholder="Search videos, tasks…"
                  className="dash-bg-transparent dash-border-none dash-text-sm dash-text-foreground dash-placeholder:text-muted-foreground dash-outline-none dash-w-full"
                />

              </div>

              <ThemeToggle />

              {/* NOTIFICATIONS */}
              <div
                className="dash-relative"
                ref={notifRef}
              >

                <button
                  type="button"
                  aria-label="Notifications"
                  className="dash-icon-btn"
                  onClick={() => {
                    setNotifOpen((v) => !v)
                    setUserOpen(false)
                  }}
                >
                  <Bell size={16} />
                  <span className="dash-notif-dot" />
                </button>

                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dash-dropdown"
                  >

                    <p className="dash-dropdown-title">
                      Notifications
                    </p>

                    <div className="dash-dropdown-list">

                      <div className="dash-dropdown-item">

                        <span className="dash-dropdown-icon dash-dropdown-icon-primary">
                          <Bell size={14} />
                        </span>

                        <div>
                          <p className="dash-dropdown-text">
                            New video available
                          </p>

                          <p className="dash-dropdown-time">
                            2 min ago
                          </p>
                        </div>

                      </div>

                      <div className="dash-dropdown-item">

                        <span className="dash-dropdown-icon dash-dropdown-icon-accent">
                          <Coins size={14} />
                        </span>

                        <div>
                          <p className="dash-dropdown-text">
                            You earned ₹5.00
                          </p>

                          <p className="dash-dropdown-time">
                            1 hour ago
                          </p>
                        </div>

                      </div>

                    </div>

                  </motion.div>
                )}

              </div>

              {/* USER */}
              <div
                className="dash-relative"
                ref={userRef}
              >

                <button
                  type="button"
                  className="dash-user-btn"
                  onClick={() => {
                    setUserOpen((v) => !v)
                    setNotifOpen(false)
                  }}
                >

                  <span className="dash-user-avatar">
                    {initials}
                  </span>

                  <span className="dash-user-name">
                    {userName}
                  </span>

                  <ChevronDown
                    size={14}
                    className="dash-user-chevron"
                  />

                </button>

                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dash-dropdown dash-dropdown-user"
                  >

                    <div className="dash-user-info">

                      <span className="dash-user-avatar-lg">
                        {initials}
                      </span>

                      <div>

                        <p className="dash-user-fullname">
                          {userName}
                        </p>

                        <p className="dash-user-email">
                          {user?.email || 'user@earnhub.app'}
                        </p>

                      </div>

                    </div>

                    <div className="dash-dropdown-divider" />

                    <button
                      onClick={() => {
                        navigate('/dashboard/settings')
                        setUserOpen(false)
                      }}
                      className="dash-dropdown-item-btn"
                    >
                      <User size={14} />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate('/dashboard/settings')
                        setUserOpen(false)
                      }}
                      className="dash-dropdown-item-btn"
                    >
                      <Settings size={14} />
                      Settings
                    </button>

                    <div className="dash-dropdown-divider" />

                    <button
                      onClick={requestLogout}
                      className="dash-dropdown-item-btn dash-dropdown-item-danger"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>

                  </motion.div>
                )}

              </div>

            </div>

          </form>

        </header>

        <main className="dash-content">
          <Outlet />
        </main>

      </div>

      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />

    </div>
  )
}