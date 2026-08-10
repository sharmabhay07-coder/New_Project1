import { motion } from 'framer-motion'
import { PlaySquare, ArrowDownToLine, Users, Target, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './quick-actions.css'

const actions = [
  { label: 'Watch Videos', icon: PlaySquare, color: 'dash-text-primary', bg: 'dash-bg-primary/12', path: '/dashboard/videos' },
  { label: 'Withdraw', icon: ArrowDownToLine, color: 'dash-text-accent', bg: 'dash-bg-accent/12', path: '/dashboard/wallet' },
  { label: 'Invite', icon: Users, color: 'dash-text-chart-3', bg: 'dash-bg-chart-3/12', path: '/dashboard/referrals' },
  { label: 'Challenges', icon: Target, color: 'dash-text-warning', bg: 'dash-bg-warning/12', path: '/dashboard/tasks' },
  { label: 'Rewards', icon: Gift, color: 'dash-text-chart-5', bg: 'dash-bg-chart-5/12', path: '/dashboard/tasks' },
]

export function QuickActions() {
  const navigate = useNavigate()

  const handleClick = (path) => {
    if (path) {
      navigate(path)
    }
  }

  return (
    <div className="dash-card dash-p-5">
      <h2 className="dash-mb-4 dash-text-base dash-font-semibold">Quick Actions</h2>
      <div className="dash-quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleClick(action.path)}
              disabled={!action.path}
              className="dash-quick-action-btn"
            >
              <span className={'dash-quick-action-icon ' + action.bg + ' ' + action.color}>
                <Icon className="dash-size-5" />
              </span>
              <span className="dash-quick-action-label">{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
