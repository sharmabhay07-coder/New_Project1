import { motion } from 'framer-motion'
import { Flame, Play, Zap, ArrowDownToLine } from 'lucide-react'
import { user, todayGoal, balances } from '@/lib/mock-data'
import { AnimatedCounter } from './animated-counter'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeBanner() {
  const goalPct = Math.min(100, Math.round((todayGoal.earned / todayGoal.target) * 100))
  const xpPct = Math.round((user.xp / user.xpToNext) * 100)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
    >
      {/* Subtle brand wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.05]" />

      <div className="relative flex flex-col gap-8 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-warning/12 px-2.5 py-1 font-semibold text-warning">
              <Flame className="size-4" />
              {user.streak} day streak
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-accent/12 px-2.5 py-1 font-semibold text-accent">
              <Zap className="size-3.5" />
              Level {user.level}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-normal leading-tight tracking-tight md:text-4xl">
            <span className="font-serif">{greeting()}, </span>
            <span className="font-serif text-primary">{user.name}</span>
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Ready to earn today? You&apos;re just{' '}
            <span className="font-semibold text-foreground">
              {balances.currency}
              {(todayGoal.target - todayGoal.earned).toFixed(2)}
            </span>{' '}
            away from your daily goal.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft-primary transition-transform hover:scale-[1.03]">
              <Play className="size-4 fill-current" /> Start Watching
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold transition-colors hover:bg-secondary">
              <ArrowDownToLine className="size-4" /> Withdraw
            </button>
          </div>
        </div>

        {/* Goal ring */}
        <div className="flex items-center gap-6">
          <div className="relative grid size-36 shrink-0 place-items-center">
            <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth="10"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - goalPct / 100) }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums">
                <AnimatedCounter value={goalPct} suffix="%" />
              </span>
              <span className="text-[11px] text-muted-foreground">of daily goal</span>
            </div>
          </div>

          <div className="hidden space-y-3 sm:block">
            <div>
              <p className="text-xs text-muted-foreground">Earned today</p>
              <p className="text-lg font-bold tabular-nums text-primary">
                <AnimatedCounter value={todayGoal.earned} prefix={balances.currency} decimals={2} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Videos watched</p>
              <p className="text-lg font-bold tabular-nums">
                {todayGoal.videosWatched}
                <span className="text-sm text-muted-foreground">/{todayGoal.videosTarget}</span>
              </p>
            </div>
            <div className="w-40">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Level {user.level}</span>
                <span>
                  {user.xp}/{user.xpToNext} XP
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
