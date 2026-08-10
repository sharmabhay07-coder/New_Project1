import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Clock, ArrowDownToLine } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'
import './stat-cards.css'

export function StatCards({ summary }) {
  const stats = [
    {
      label: 'Total Balance',
      value: summary?.totalBalance ?? 0,
      icon: Wallet,
      accent: 'dash-text-primary',
      chip: 'dash-badge-primary',
      trend: 'Available',
      highlight: true,
    },
    {
      label: 'Total Earnings',
      value: summary?.totalEarnings ?? 0,
      icon: TrendingUp,
      accent: 'dash-text-accent',
      chip: 'dash-badge-accent',
      trend: 'Lifetime',
      highlight: false,
    },
    {
      label: 'Pending Tasks',
      value: summary?.pendingTasks ?? 0,
      icon: Clock,
      accent: 'dash-text-warning',
      chip: 'dash-badge-warning',
      trend: 'In Review',
      highlight: false,
    },
    {
      label: 'Completed Tasks',
      value: summary?.completedTasks ?? 0,
      icon: ArrowDownToLine,
      accent: 'dash-text-foreground',
      chip: 'dash-badge-primary',
      trend: 'Done',
      highlight: false,
    },
  ]

  return (
    <div className="dash-grid dash-grid-cols-2 dash-lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            className={
              'dash-stat-card ' + (stat.highlight ? 'dash-stat-card-highlight' : 'dash-card')
            }
          >
            <div className="dash-flex dash-items-center dash-justify-between">
              <span className={'dash-stat-card-icon ' + stat.chip}>
                <Icon style={{ width: 18, height: 18 }} />
              </span>
              <span className={'dash-stat-card-trend ' + stat.accent}>
                {stat.trend}
              </span>
            </div>
            <p className="dash-stat-card-value">
              <AnimatedCounter value={stat.value} prefix="\u20B9" decimals={2} />
            </p>
            <p className="dash-stat-card-label">{stat.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
