import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  UserPlus,
  ClipboardCheck,
  Wallet,
  Gift,
  ArrowRight,
  Check,
  Lock,
} from 'lucide-react'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    shortTitle: 'Create Account',
    description:
      'Sign up for your EarnHub account using your basic information. Registration is quick and simple.',
    status: 'Account created successfully!',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Choose a Plan',
    shortTitle: 'Choose Plan',
    description:
      'Explore the available business plans and select the option that matches your earning goals.',
    status: 'Plan selected successfully!',
  },
  {
    number: '03',
    icon: Gift,
    title: 'Complete Tasks',
    shortTitle: 'Complete Tasks',
    description:
      'Complete available tasks and activities to earn rewards through the EarnHub platform.',
    status: 'Task completed! You earned rewards.',
  },
  {
    number: '04',
    icon: Wallet,
    title: 'Earn & Withdraw',
    shortTitle: 'Earn & Withdraw',
    description:
      'Track your earnings from your dashboard and manage your available balance easily.',
    status: 'You can now manage your earnings.',
  },
]

const benefits = [
  {
    icon: UserPlus,
    title: 'Easy to Get Started',
    description:
      'Create your account and get started with a simple and straightforward process.',
  },
  {
    icon: ClipboardCheck,
    title: 'Simple Tasks',
    description:
      'Find available activities and complete them through your EarnHub dashboard.',
  },
  {
    icon: Gift,
    title: 'Multiple Earning Options',
    description:
      'Explore tasks, referrals and business plans available on the platform.',
  },
  {
    icon: Wallet,
    title: 'Track Your Earnings',
    description:
      'Keep track of your rewards, balance and earning activity from one dashboard.',
  },
]

const earningPoints = [
  'Complete available tasks',
  'Earn rewards from eligible activities',
  'Invite others through referrals',
  'Monitor your balance and activity',
]

const previewStats = [
  ['Tasks', '24'],
  ['Referrals', '08'],
  ['Balance', '₹4,850'],
]

const chartBars = [35, 55, 45, 70, 60, 82, 95]

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -8 },
}

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.12, rotate: 8 },
}

const cardTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
}

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedIndex, setCompletedIndex] = useState(null)

  const timeoutRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((current) => {
        const completed = current
        const next = (current + 1) % steps.length

        setCompletedIndex(completed)

        clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
          setCompletedIndex(null)
        }, 700)

        return next
      })
    }, 3500)

    return () => {
      clearInterval(timer)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <main className="how-page">
      {/* HERO */}
      <section className="how-hero">
        <div className="how-hero-content">
          <div className="how-hero-badge">
            <span className="how-hero-badge-dot" />
            Simple & Easy Process
          </div>

          <h1 className="how-hero-title">
            How <span>EarnHub</span> Works
          </h1>

          <p className="how-hero-description">
            Getting started with EarnHub is simple. Create your account,
            choose your plan, complete tasks and start tracking your earnings.
          </p>

          <motion.a
            href="/auth"
            className="how-primary-btn"
            whileHover={{ y: -2, opacity: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            Get Started
            <ArrowRight size={18} />
          </motion.a>
        </div>

        {/* FLOW */}
        <div className="how-hero-visual">
          <motion.div
            className="how-flow-glow"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [0.95, 1.08, 0.95],
                    opacity: [0.7, 1, 0.7],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <svg
            className="how-flow-svg"
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <circle
              className="how-flow-base"
              cx="250"
              cy="250"
              r="170"
            />

            <motion.circle
              className="how-flow-progress"
              cx="250"
              cy="250"
              r="170"
              animate={{
                strokeDashoffset: 1068 - (1068 / 4) * currentStep,
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />

            <motion.circle
              className="how-flow-moving-line"
              cx="250"
              cy="250"
              r="170"
              animate={
                reduceMotion
                  ? undefined
                  : { strokeDashoffset: [0, -1068] }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>

          {/* CENTER */}
          <motion.div
            className="how-hero-main-card"
            animate={
              reduceMotion ? undefined : { y: [0, -5, 0] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="how-hero-main-icon">
              <Wallet size={30} />
            </div>

            <div>
              <strong>Start Earning</strong>
              <p>Track everything from your dashboard</p>
            </div>
          </motion.div>

          {/* FLOW STEPS */}
          {steps.map((step, index) => {
            const isCompleted = currentStep > index
            const isCurrent = currentStep === index
            const StepIcon = isCompleted ? Check : step.icon
            const isPulsing = completedIndex === index

            return (
              <motion.div
                key={step.number}
                className={`how-flow-step how-flow-step-${index + 1} ${
                  isCurrent
                    ? 'current'
                    : isCompleted
                      ? 'completed'
                      : ''
                }`}
                animate={
                  isPulsing
                    ? { scale: [0.96, 1.05, 1] }
                    : { scale: isCurrent ? 1.03 : 1 }
                }
                transition={{
                  duration: isPulsing ? 0.7 : 0.3,
                  ease: 'easeOut',
                }}
              >
                <div className="how-flow-step-icon">
                  <StepIcon size={16} />
                </div>

                <div className="how-flow-step-content">
                  <span>{step.number}</span>
                  <strong>{step.shortTitle}</strong>

                  {isCompleted && (
                    <small>
                      <Check size={10} />
                      Completed
                    </small>
                  )}

                  {isCurrent && (
                    <small className="current-label">
                      Current Step
                    </small>
                  )}

                  {!isCompleted && !isCurrent && (
                    <small className="pending-label">
                      <Lock size={10} />
                      Upcoming
                    </small>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* STATUS */}
          <motion.div
            className="how-flow-status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="how-flow-status-icon">
              <Check size={13} />
            </div>

            <span>{steps[currentStep].status}</span>
          </motion.div>
        </div>
      </section>

      {/* STEPS */}
      <section className="how-steps-section">
        <SectionHeading
          label="THE PROCESS"
          title={
            <>
              Start earning in <span>4 simple steps</span>
            </>
          }
          description="Follow these simple steps to get started with EarnHub."
        />

        <div className="how-steps-grid">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.number}
                className="how-step-card"
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={cardVariants}
                transition={cardTransition}
              >
                <div className="how-step-top">
                  <span className="how-step-number">
                    {step.number}
                  </span>

                  <motion.div
                    className="how-step-icon"
                    variants={iconVariants}
                  >
                    <Icon size={22} />
                  </motion.div>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* EARNING */}
      <section className="how-earning-section">
        <div className="how-earning-content">
          <span className="how-section-label">
            HOW EARNING WORKS
          </span>

          <h2>
            Everything you need in
            <span> one place</span>
          </h2>

          <p>
            Your EarnHub dashboard gives you a clear view of your
            activities, rewards and account information so you can
            easily manage your earning journey.
          </p>

          <div className="how-earning-points">
            {earningPoints.map((point) => (
              <div key={point}>
                <span>✓</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="how-dashboard-preview">
          <div className="how-preview-header">
            <div>
              <small>Total Earnings</small>
              <strong>₹12,450</strong>
            </div>

            <div className="how-preview-icon">
              <Wallet size={21} />
            </div>
          </div>

          <div className="how-preview-line" />

          <div className="how-preview-stats">
            {previewStats.map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="how-preview-chart">
            {chartBars.map((height) => (
              <span
                key={height}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="how-benefits-section">
        <SectionHeading
          label="WHY EARNHUB"
          title={
            <>
              Built to make earning
              <span> simple</span>
            </>
          }
          description="Everything is designed to keep your earning experience simple, clear and easy to manage."
        />

        <div className="how-benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <motion.div
                key={benefit.title}
                className="how-benefit-card"
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={cardVariants}
                transition={cardTransition}
              >
                <motion.div
                  className="how-benefit-icon"
                  variants={iconVariants}
                >
                  <Icon size={21} />
                </motion.div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="how-cta">
        <div>
          <span className="how-section-label">
            READY TO START?
          </span>

          <h2>Start your EarnHub journey today.</h2>

          <p>
            Create your account and explore the opportunities available
            on EarnHub.
          </p>
        </div>

        <motion.a
          href="/auth"
          className="how-cta-btn"
          whileHover={{ y: -2, opacity: 0.92 }}
          transition={{ duration: 0.2 }}
        >
          Create Account
          <ArrowRight size={18} />
        </motion.a>
      </section>
    </main>
  )
}

function SectionHeading({ label, title, description }) {
  return (
    <div className="how-section-heading">
      <span className="how-section-label">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}