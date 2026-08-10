import { motion } from 'framer-motion'
import { Play, ArrowDownToLine } from 'lucide-react'
import './welcome-banner.css'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeBanner({ name }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="dash-welcome-banner"
    >
      <div className="dash-welcome-banner-gradient" />

      <div className="dash-welcome-banner-content">
        <div className="dash-welcome-banner-text">
          <h1 className="dash-welcome-banner-title">
            <span className="dash-font-serif">{greeting()}, </span>
            <span className="dash-font-serif dash-text-primary">{name || 'User'}</span>
          </h1>
          <p className="dash-welcome-banner-desc">
            Ready to earn today? Check your dashboard for latest updates.
          </p>

          <div className="dash-welcome-banner-actions">
            <button className="dash-btn dash-btn-primary">
              <Play className="dash-size-4" fill="currentColor" /> Start Watching
            </button>
            <button className="dash-btn dash-btn-ghost">
              <ArrowDownToLine className="dash-size-4" /> Withdraw
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
