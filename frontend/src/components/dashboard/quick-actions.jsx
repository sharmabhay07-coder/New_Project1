import { motion } from 'framer-motion'
import { PlaySquare, ArrowDownToLine, Users, Target, Gift, Upload } from 'lucide-react'

const actions = [
  { label: 'Watch Videos', icon: PlaySquare, color: 'text-primary', bg: 'bg-primary/12' },
  { label: 'Withdraw', icon: ArrowDownToLine, color: 'text-accent', bg: 'bg-accent/12' },
  { label: 'Invite', icon: Users, color: 'text-chart-3', bg: 'bg-chart-3/12' },
  { label: 'Challenges', icon: Target, color: 'text-warning', bg: 'bg-warning/12' },
  { label: 'Rewards', icon: Gift, color: 'text-chart-5', bg: 'bg-chart-5/12' },
  { label: 'Upload', icon: Upload, color: 'text-foreground', bg: 'bg-secondary' },
]

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-base font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/40 p-3 text-center transition-colors hover:bg-secondary"
            >
              <span className={`grid size-10 place-items-center rounded-xl ${action.bg} ${action.color}`}>
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-medium leading-tight">{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
