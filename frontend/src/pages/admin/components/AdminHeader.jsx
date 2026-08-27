import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
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
  const { user } = useAuth()
  const userName = user?.name || 'Admin'
  const initials = userName.slice(0, 2).toUpperCase()

  return (
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
        </nav>

        <div className="dash-header-right">
          <ThemeToggle />
          <div className="dash-user-btn" style={{ cursor: 'default' }}>
            <span className="dash-user-avatar">{initials}</span>
            <span className="dash-user-name">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}