import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import './PlanCard.css'
export default function PlanCard({ plan, index = 0, onChoose }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.35,
        ease: 'easeOut',
      }}
      className={`plan-card ${plan.highlight ? 'plan-card--popular' : ''}`}
    >
      {plan.tag && (
        <span className="plan-card-badge">
          {plan.tag}
        </span>
      )}

      <div className="plan-card-content">
        <h3 className="plan-card-name">
          {plan.name}
        </h3>

        {plan.quantity && (
          <p className="plan-card-quantity">
            {plan.quantity}
          </p>
        )}

        <div className="plan-card-price">
          <span className="plan-card-price-currency">₹</span>

          <span className="plan-card-price-amount">
            {plan.price}
          </span>

          {plan.period && (
            <span className="plan-card-price-period">
              /{plan.period}
            </span>
          )}
        </div>

        <ul className="plan-card-features">
          {plan.features?.map((feature, featureIndex) => (
            <li key={`${feature}-${featureIndex}`}>
              <Check
                className="plan-card-check"
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
              />

              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onChoose?.(plan)}
          className={`plan-card-btn ${
            plan.highlight ? 'plan-card-btn--primary' : 'plan-card-btn--outline'
          }`}
        >
          Choose {plan.name}
        </button>
      </div>
    </motion.article>
  )
}