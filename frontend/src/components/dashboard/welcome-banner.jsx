import { motion } from 'framer-motion'
import { DollarSign, Eye, TrendingUp } from 'lucide-react'
import './welcome-banner.css'

function greeting() {
  const h = new Date().getHours()

  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'

  return 'Good evening'
}

const StatCard = ({ icon, label, value, variant }) => (
  <motion.div
    className={`stat-card ${variant}`}
    whileHover={{
      y: -6,
      scale: 1.02,
    }}
    transition={{
      duration: 0.2,
      ease: 'easeOut',
    }}
  >
    <div className="stat-card-header">
      <div className="stat-card-icon">{icon}</div>

      <span className="stat-card-label">
        {label}
      </span>
    </div>

    <div className="stat-card-value">
      {value}
    </div>

    {/* <div className="stat-card-footer">
      View Details
    </div> */}
  </motion.div>
)

export function WelcomeBanner({ name, summary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="dash-welcome-banner"
    >
      <div className="dash-welcome-banner-gradient" />

      <div className="dash-welcome-banner-content">
        <div className="dash-welcome-banner-text">
          <h1 className="dash-welcome-banner-title">
            {greeting()},{' '}
            <span className="dash-text-primary">
              {name || 'User'}
            </span>
            !
          </h1>

          <p className="dash-welcome-banner-desc">
            Welcome to your dashboard. Here's a summary of your account activity.
          </p>
        </div>

        <div className="stats-container">
          <StatCard
            label="Balance"
            value={formatCurrency(summary?.balance)}
            icon={<DollarSign className="dash-size-5" />}
            variant="balance-card"
          />

          <StatCard
            label="Total Earnings"
            value={formatCurrency(summary?.totalEarnings)}
            icon={<TrendingUp className="dash-size-5" />}
            variant="earnings-card"
          />

          <StatCard
            label="Today's Earnings"
            value={formatCurrency(summary?.todayEarnings)}
            icon={<Eye className="dash-size-5" />}
            variant="today-card"
          />
        </div>
      </div>
    </motion.section>
  )
}