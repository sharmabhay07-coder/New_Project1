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
  rest: {
    y: 0,
  },
  hover: {
    y: -8,
  },
}

const iconVariants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.12,
    rotate: 8,
  },
}

const cardTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
}

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedIndex, setCompletedIndex] = useState(null)

  // Typewriter
  const [typedTitle, setTypedTitle] = useState('')

  const timeoutRef = useRef(null)
  const typewriterRef = useRef(null)

  const reduceMotion = useReducedMotion()

  const fullTitle = 'How EarnHub Works'

  /*
    TYPEWRITER EFFECT
    No blinking cursor.
  */
  useEffect(() => {
    if (reduceMotion) {
      setTypedTitle(fullTitle)
      return
    }

    let index = 0

    typewriterRef.current = setInterval(() => {
      index += 1

      setTypedTitle(fullTitle.slice(0, index))

      if (index >= fullTitle.length) {
        clearInterval(typewriterRef.current)
      }
    }, 75)

    return () => {
      clearInterval(typewriterRef.current)
    }
  }, [reduceMotion])

  /*
    FLOW ANIMATION
  */
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

  /*
    Render typed title while keeping EarnHub green.
  */
  const renderTypedTitle = () => {
    const howText = 'How '
    const brandText = 'EarnHub'
    const worksText = ' Works'

    const howLength = howText.length
    const brandLength = brandText.length

    const typedHow = typedTitle.slice(0, howLength)

    const brandStart = Math.max(0, typedTitle.length - howLength)
    const typedBrand = brandText.slice(
      0,
      Math.min(brandLength, brandStart)
    )

    const worksStart = Math.max(
      0,
      typedTitle.length - howLength - brandLength
    )

    const typedWorks = worksText.slice(0, worksStart)

    return (
      <>
        {typedHow}

        {typedBrand && (
          <span>
            {typedBrand}
          </span>
        )}

        {typedWorks}
      </>
    )
  }

  return (
    <main className="how-page">
      {/* =========================
          HERO
      ========================= */}

      <section className="how-hero">
        <div className="how-hero-content">
          <motion.div
            className="how-hero-badge"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={{
              duration: 0.6,
            }}
          >
            <span className="how-hero-badge-dot" />
            Simple & Easy Process
          </motion.div>

          <h1 className="how-hero-title">
            {renderTypedTitle()}
          </h1>

          <motion.p
            className="how-hero-description"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={{
              delay: 1.15,
              duration: 0.7,
            }}
          >
            Getting started with EarnHub is simple. Create your account,
            choose your plan, complete tasks and start tracking your earnings.
          </motion.p>

          <motion.a
            href="/auth"
            className="how-primary-btn"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={{
              delay: 1.3,
              duration: 0.6,
            }}
            whileHover={{
              y: -2,
              opacity: 0.92,
            }}
          >
            Get Started
            <ArrowRight size={18} />
          </motion.a>
        </div>

        {/* =========================
            FLOW VISUAL
        ========================= */}

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
                strokeDashoffset:
                  1068 - (1068 / 4) * currentStep,
              }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
              }}
            />

            <motion.circle
              className="how-flow-moving-line"
              cx="250"
              cy="250"
              r="170"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      strokeDashoffset: [0, -1068],
                    }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>

          {/* CENTER CARD */}

          <motion.div
            className="how-hero-main-card"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -5, 0],
                  }
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
              <p>
                Track everything from your dashboard
              </p>
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
                    ? {
                        scale: [0.96, 1.05, 1],
                      }
                    : {
                        scale: isCurrent ? 1.03 : 1,
                      }
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

                  <strong>
                    {step.shortTitle}
                  </strong>

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
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 6,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div className="how-flow-status-icon">
              <Check size={13} />
            </div>

            <span>
              {steps[currentStep].status}
            </span>
          </motion.div>
        </div>
      </section>

      {/* =========================
          STEPS
      ========================= */}

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

      {/* =========================
          EARNING
      ========================= */}

      <section className="how-earning-section">
        {/* LEFT CONTENT */}

        <motion.div
          className="how-earning-content"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -60,
                }
          }
          whileInView={
            reduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.span
            className="how-section-label"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }
            whileInView={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
          >
            HOW EARNING WORKS
          </motion.span>

          <motion.h2
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{
              delay: 0.25,
              duration: 0.6,
            }}
          >
            Everything you need in
            <span> one place</span>
          </motion.h2>

          <motion.p
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{
              delay: 0.35,
              duration: 0.6,
            }}
          >
            Your EarnHub dashboard gives you a clear view of your
            activities, rewards and account information so you can
            easily manage your earning journey.
          </motion.p>

          <div className="how-earning-points">
            {earningPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -25,
                      }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        x: 0,
                      }
                }
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.45 + index * 0.12,
                  duration: 0.5,
                }}
              >
                <motion.span
                  initial={
                    reduceMotion
                      ? false
                      : {
                          scale: 0,
                        }
                  }
                  whileInView={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1,
                        }
                  }
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.12,
                    duration: 0.35,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  ✓
                </motion.span>

                <p>{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT DASHBOARD */}

        <motion.div
          className="how-dashboard-preview"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 70,
                  scale: 0.94,
                }
          }
          whileInView={
            reduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }
          }
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="how-preview-header">
            <div>
              <small>Total Earnings</small>

              <motion.strong
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                      }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                }}
              >
                ₹12,450
              </motion.strong>
            </div>

            <motion.div
              className="how-preview-icon"
              initial={
                reduceMotion
                  ? false
                  : {
                      scale: 0,
                      rotate: -20,
                    }
              }
              whileInView={
                reduceMotion
                  ? undefined
                  : {
                      scale: 1,
                      rotate: 0,
                    }
              }
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.55,
                duration: 0.5,
                type: 'spring',
                stiffness: 180,
              }}
            >
              <Wallet size={21} />
            </motion.div>
          </div>

          <div className="how-preview-line" />

          <div className="how-preview-stats">
            {previewStats.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 15,
                      }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.65 + index * 0.1,
                  duration: 0.4,
                }}
              >
                <small>{label}</small>
                <strong>{value}</strong>
              </motion.div>
            ))}
          </div>

          {/* CHART */}

          <div className="how-preview-chart">
            {chartBars.map((height, index) => (
              <motion.span
                key={`${height}-${index}`}
                initial={
                  reduceMotion
                    ? false
                    : {
                        height: 0,
                        opacity: 0,
                      }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : {
                        height: `${height}%`,
                        opacity: 1,
                      }
                }
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.75 + index * 0.08,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* =========================
          BENEFITS
      ========================= */}

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

      {/* =========================
          CTA
      ========================= */}

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
          whileHover={{
            y: -2,
            opacity: 0.92,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          Create Account
          <ArrowRight size={18} />
        </motion.a>
      </section>
    </main>
  )
}

/* =========================
   SECTION HEADING
========================= */

function SectionHeading({
  label,
  title,
  description,
}) {
  return (
    <div className="how-section-heading">
      <span className="how-section-label">
        {label}
      </span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  )
}