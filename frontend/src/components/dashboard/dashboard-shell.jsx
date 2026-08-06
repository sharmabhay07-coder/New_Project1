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
import { user, balances } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft-primary">
        <Zap className="size-5" strokeWidth={2.5} />
      </div>
      <div className="leading-none">
        <span className="font-serif text-xl tracking-tight">EarnHub</span>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        item.active
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                      )}
                    >
                      {item.active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                        />
                      )}
                      <Icon
                        className={cn(
                          'size-[18px] shrink-0 transition-colors',
                          item.active
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                            item.badge === 'New'
                              ? 'bg-accent/12 text-accent'
                              : 'bg-primary/12 text-primary',
                          )}
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

      <div className="p-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            Go Premium
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Unlock 2x rewards and instant withdrawals.
          </p>
          <button className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar lg:hidden"
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"
              >
                <X className="size-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border surface-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search videos, categories, creators..."
                className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 sm:flex">
                <Wallet className="size-4 text-primary" />
                <span className="text-sm font-bold tabular-nums">
                  {balances.currency}
                  {balances.total.toFixed(2)}
                </span>
              </div>

              <ThemeToggle />

              <button
                aria-label="Notifications"
                className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
              </button>

              <button className="flex items-center gap-2 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-secondary">
                <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {user.avatarInitials}
                </span>
                <span className="hidden text-sm font-medium sm:block">{user.name}</span>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

function Wallet({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

