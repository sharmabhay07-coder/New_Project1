import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import useAuth from '@/hooks/useAuth'

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

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const userName = user?.name || 'Admin'
  const initials = userName.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="dash-header">
        <div
          className="dash-flex dash-h-16 dash-items-center dash-justify-between dash-px-4 dash-md:px-6 dash-w-full"
        >
          <div className="dash-flex dash-items-center dash-gap-2">
            <div className="dash-sidebar-logo">
              <h1 className="dash-logo-text">
                Earn <span>Hub</span>
              </h1>
            </div>
            {/* <span className="dash-text-xs dash-font-semibold dash-text-muted-foreground dash-ml-1">
              Admin
            </span> */}
          </div>

          <nav className="dash-header-nav">
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/users">Users</NavLink>
            <NavLink to="/admin/videos">Videos</NavLink>
            <NavLink to="/admin/tasks">Tasks</NavLink>
          </nav>

          <div className="dash-header-right">
            <ThemeToggle />
            <div className="dash-user-btn" style={{ cursor: 'default' }}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={userName} className="dash-user-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <span className="dash-user-avatar">{initials}</span>
              )}
              <span className="dash-user-name">{userName}</span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="dash-flex dash-items-center dash-justify-center dash-size-8 dash-rounded-full dash-bg-destructive/10 dash-text-destructive dash-hover:bg-destructive/20 dash-transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-p-4"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="dash-w-full dash-max-w-sm dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-6 dash-shadow-soft-lg"
            >
              <h2 className="dash-m-0 dash-text-lg dash-font-bold dash-text-foreground">
                Confirm Logout
              </h2>
              <p className="dash-mt-2 dash-text-sm dash-text-muted-foreground">
                Are you sure you want to log out of the admin panel?
              </p>
              <div className="dash-flex dash-gap-3 dash-pt-5">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="dash-flex-1 dash-rounded-xl dash-border dash-border-border dash-py-2 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="dash-flex-1 dash-rounded-lg dash-bg-destructive dash-px-3 dash-py-2 dash-text-sm dash-font-bold dash-text-white dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}