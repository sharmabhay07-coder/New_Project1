import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { features } from './featuresData'
import './FeaturesPage.css'

const accentColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function FeaturesPage() {
  return (
    <div className="feat-page">

      {/* HERO */}
      <motion.section
        className="feat-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="feat-hero-badge" variants={fadeUp}>
          <Sparkles size={14} />
          Everything in One Platform
        </motion.div>

        <motion.h1 className="feat-hero-title" variants={fadeUp}>
          Built for the way <span>you earn</span>
        </motion.h1>

        <motion.p className="feat-hero-description" variants={fadeUp}>
          From watching videos to promoting your business, EarnHub brings every
          earning tool you need into one simple, reliable platform.
        </motion.p>

        <motion.a href="/auth" className="feat-hero-btn" variants={fadeUp} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
          Get Started
          <ArrowRight size={18} />
        </motion.a>
      </motion.section>

      {/* FEATURE GRID */}
      <motion.div
        className="feat-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={staggerContainer}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          const accent = accentColors[index % accentColors.length]

          return (
            <motion.div
              key={feature.id}
              className="feat-card"
              style={{ '--accent': accent }}
              variants={cardItem}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className="feat-card-icon">
                <Icon size={22} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* CTA */}
      <motion.section
        className="feat-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <h2>Ready to put these features to work?</h2>
          <p>Create your free account and start earning in minutes.</p>
        </div>

        <motion.a
          href="/auth"
          className="feat-cta-btn"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          Create Account
          <ArrowRight size={18} />
        </motion.a>
      </motion.section>

    </div>
  )
}