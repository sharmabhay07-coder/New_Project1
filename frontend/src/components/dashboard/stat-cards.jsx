import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Clock, ArrowDownToLine, ArrowUpRight } from 'lucide-react'
import { balances } from '@/lib/mock-data'
import { AnimatedCounter } from './animated-counter'
import { cn } from '@/lib/utils'

export function StatCards({ summary }) {
  const stats = [
    {
      label: 'Total Balance',
      value: summary?.totalBalance || 0,
      icon: Wallet,
      accent: 'text-primary',
      chip: 'bg-primary/12 text-primary',
      trend: 'Available',
      highlight: true,
    },
    {
      label: 'Total Earnings',
      value: summary?.totalEarnings || 0,
      icon: TrendingUp,
      accent: 'text-accent',
      chip: 'bg-accent/12 text-accent',
      trend: 'Lifetime',
      highlight: false,
    },
    {
      label: 'Pending Tasks',
      value: summary?.pendingTasks || 0,
      icon: Clock,
      accent: 'text-warning',
      chip: 'bg-warning/12 text-warning',
      trend: 'In Review',
      highlight: false,
    },
    {
      label: 'Completed Tasks',
      value: summary?.completedTasks || 0,
      icon: ArrowDownToLine,
      accent: 'text-foreground',
      chip: 'bg-secondary text-muted-foreground',
      trend: 'Done',
      highlight: false,
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative overflow-hidden rounded-2xl border p-4 md:p-5',
              stat.highlight ? 'border-primary/30 bg-primary/[0.06]' : 'border-border bg-card',
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('grid size-9 place-items-center rounded-xl', stat.chip)}>
                <Icon className="size-[18px]" />
              </span>
              <span
                className={cn(
                  'flex items-center gap-0.5 text-[11px] font-semibold',
                  stat.accent,
                )}
              >
                {stat.trend.startsWith('+') && <ArrowUpRight className="size-3" />}
                {stat.trend}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold tabular-nums md:text-3xl">
              <AnimatedCounter value={stat.value} prefix={balances.currency} decimals={2} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

