import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  Search,
  Bell,
  Zap,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { navSections } from './nav-config'
import { ThemeToggle } from './theme-toggle'
import './dashboard-shell.css'

function Logo() {
  return (
    <div className="dash-flex dash-items-center dash-gap-2.5">
      <div className="dash-grid dash-size-9 dash-place-items-center dash-rounded-xl dash-bg-primary dash-text-primary-foreground dash-shadow-soft-primary">
        <Zap className="dash-size-5" strokeWidth={2.5} />
      </div>
      <div className="dash-leading-none">
        <span className="dash-font-serif dash-text-xl dash-tracking-tight">EarnHub</span>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="dash-flex dash-h-full dash-flex-col">
      <div className="dash-flex dash-h-16 dash-items-center dash-px-5">
        <Logo />
      </div>

      <nav className="dash-flex-1 dash-space-y-6 dash-overflow-y-auto dash-px-3 dash-py-4 dash-scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="dash-px-3 dash-pb-2 dash-text-11px dash-font-semibold dash-uppercase dash-tracking-wider dash-text-muted-foreground/70">
              {section.title}
            </p>
            <ul className="dash-space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onNavigate}
                      className={
                        'dash-group dash-relative dash-flex dash-items-center dash-gap-3 dash-rounded-xl dash-px-3 dash-py-2.5 dash-text-sm dash-font-medium dash-transition-colors ' +
                        (item.active
                          ? 'dash-bg-primary/10 dash-text-foreground'
                          : 'dash-text-muted-foreground dash-hover:bg-sidebar-accent dash-hover:text-foreground')
                      }
                    >
                      {item.active && (
                        <motion.span
                          layoutId="nav-active"
                          className="dash-absolute dash-left-0 dash-h-6 dash-w-1 dash-rounded-r-full dash-bg-primary"
                        />
                      )}
                      <Icon
                        className={
                          'dash-size-[18px] dash-shrink-0 dash-transition-colors ' +
                          (item.active ? 'dash-text-primary' : 'dash-text-muted-foreground dash-group-hover:text-foreground')
                        }
                      />
                      <span className="dash-flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={
                            'dash-rounded-full dash-px-2 dash-py-0.5 dash-text-[10px] dash-font-bold ' +
                            (item.badge === 'New'
                              ? 'dash-bg-accent/12 dash-text-accent'
                              : 'dash-bg-primary/12 dash-text-primary')
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="dash-p-3">
        <div className="dash-overflow-hidden dash-rounded-2xl dash-border dash-border-border dash-bg-secondary/60 dash-p-4">
          <div className="dash-flex dash-items-center dash-gap-2 dash-text-sm dash-font-semibold">
            <Sparkles className="dash-size-4 dash-text-primary" />
            Go Premium
          </div>
          <p className="dash-mt-1 dash-text-xs dash-leading-relaxed dash-text-muted-foreground">
            Unlock 2x rewards and instant withdrawals.
          </p>
          <button className="dash-mt-3 dash-w-full dash-rounded-xl dash-bg-primary dash-py-2 dash-text-xs dash-font-bold dash-text-primary-foreground dash-transition-transform dash-hover:scale-[1.02]">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children, userName, initials, balance }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="dash-overlay"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="dash-mobile-sidebar"
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="dash-absolute dash-right-3 dash-top-4 dash-grid dash-size-8 dash-place-items-center dash-rounded-lg dash-text-muted-foreground dash-hover:bg-sidebar-accent"
              >
                <X className="dash-size-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="dash-main">
        <header className="dash-header">
          <div className="dash-flex dash-h-16 dash-items-center dash-gap-3 dash-px-4 dash-md:px-6">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="dash-grid dash-size-9 dash-place-items-center dash-rounded-xl dash-border dash-border-border dash-text-muted-foreground dash-hover:text-foreground dash-lg:hidden"
            >
              <Menu className="dash-size-5" />
            </button>

            <div className="dash-relative dash-hidden dash-max-w-sm dash-flex-1 dash-md:block">
              <Search className="dash-absolute dash-left-3 dash-top-1/2 dash-size-4 dash-text-muted-foreground" />
              <input
                type="search"
                placeholder="Search videos, categories, creators..."
                className="dash-h-10 dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-card dash-pl-9 dash-pr-4 dash-text-sm dash-text-foreground dash-placeholder:text-muted-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
              />
            </div>

            <div className="dash-ml-auto dash-flex dash-items-center dash-gap-2 dash-md:gap-3">
              <div className="dash-hidden dash-items-center dash-gap-2 dash-rounded-xl dash-border dash-border-border dash-bg-card dash-px-3 dash-py-2 dash-sm:flex">
                <span className="dash-text-sm dash-font-bold dash-tabular-nums dash-text-primary">
                  ₹{balance?.toFixed(2) || '0.00'}
                </span>
              </div>

              <ThemeToggle />

              <button
                aria-label="Notifications"
                className="dash-relative dash-grid dash-size-9 dash-place-items-center dash-rounded-xl dash-border dash-border-border dash-bg-card dash-text-muted-foreground dash-hover:text-foreground"
              >
                <Bell className="dash-size-[18px]" />
                <span className="dash-notif-dot" />
              </button>

              <button className="dash-flex dash-items-center dash-gap-2 dash-rounded-xl dash-border dash-border-border dash-bg-card dash-py-1.5 dash-pl-1.5 dash-pr-2.5 dash-transition-colors dash-hover:bg-secondary">
                <span className="dash-grid dash-size-7 dash-place-items-center dash-rounded-lg dash-bg-primary dash-text-xs dash-font-bold dash-text-primary-foreground">
                  {initials}
                </span>
                <span className="dash-hidden dash-text-sm dash-font-medium dash-sm:block">{userName}</span>
                <ChevronDown className="dash-hidden dash-size-4 dash-text-muted-foreground dash-sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  )
}
