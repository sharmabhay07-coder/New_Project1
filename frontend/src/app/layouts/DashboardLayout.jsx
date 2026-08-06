import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu, X, Search, Bell, Zap, ChevronDown, Sparkles,
  LayoutDashboard, PlaySquare, Wallet, Users, Trophy,
  Target, Settings, LifeBuoy, Sun, Moon,
} from 'lucide-react'
import './DashboardLayout.css'

const navSections = [
  {
    title: 'Earn',
    items: [
      { label: 'Dashboard',    icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Watch Videos', icon: PlaySquare,       href: '/dashboard/videos', badge: 'New' },
      { label: 'Tasks',        icon: Target,           href: '/dashboard/tasks' },
      { label: 'Leaderboard',  icon: Trophy,           href: '/dashboard/leaderboard' },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'Wallet',    icon: Wallet, href: '/dashboard/wallet' },
      { label: 'Referrals', icon: Users,  href: '/dashboard/referrals' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', icon: Settings,  href: '/dashboard/settings' },
      { label: 'Support',  icon: LifeBuoy,  href: '/dashboard/support' },
    ],
  },
]

function SidebarInner({ onNavigate }) {
  return (
    <>
      {/* Logo */}
      <div className="dash-sidebar-logo">
        <div className="dash-logo-icon">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <span className="dash-logo-text">EarnHub</span>
      </div>

      {/* Nav */}
      <nav className="dash-nav">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="dash-nav-section-title">{section.title}</p>
            <ul className="dash-nav-list">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.href}
                      end={item.href === '/dashboard'}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `dash-nav-link${isActive ? ' active' : ''}`
                      }
                    >
                      <Icon className="dash-nav-icon" />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span className="dash-nav-badge">{item.badge}</span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Premium card */}
      <div className="dash-sidebar-footer">
        <div className="dash-premium-card">
          <div className="dash-premium-title">
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            Go Premium
          </div>
          <p className="dash-premium-desc">Unlock 2x rewards and instant withdrawals.</p>
          <button className="dash-premium-btn">Upgrade Now</button>
        </div>
      </div>
    </>
  )
}

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )
  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setDark((d) => !d)
  }
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="dash-icon-btn">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const userName = localStorage.getItem('earnhub_name') || 'User'
  const initials  = userName.slice(0, 2).toUpperCase()

  return (
    <div className="dash-shell">
      {/* Desktop sidebar */}
      <aside className="dash-sidebar">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="dash-overlay"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="dash-mobile-sidebar"
            >
              <button
                className="dash-mobile-close"
                onClick={() => setMobileOpen(false)}
              >
                <X size={16} />
              </button>
              <SidebarInner onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="dash-main">
        {/* Top header */}
        <header className="dash-header">
          <button
            className="dash-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="dash-header-search">
            <Search className="dash-search-icon" size={15} />
            <input type="search" placeholder="Search videos, tasks…" />
          </div>

          {/* Right controls */}
          <div className="dash-header-right">
            <ThemeToggle />

            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="dash-notif-dot" />
            </button>

            <button className="dash-user-btn">
              <span className="dash-user-avatar">{initials}</span>
              <span className="dash-user-name">{userName}</span>
              <ChevronDown size={14} style={{ color: 'var(--muted-fg)' }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}