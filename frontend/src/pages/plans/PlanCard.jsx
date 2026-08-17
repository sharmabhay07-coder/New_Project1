import { Check, Star } from 'lucide-react'
import './PlanCard.css'

export default function PlanCard({ plan, onSelect }) {
  const { name, price, quantity, features, popular } = plan

  return (
    <div className={`plan-card${popular ? ' plan-card--popular' : ''}`}>
      {popular && (
        <span className="plan-card-badge">
          <Star size={12} /> Most Popular
        </span>
      )}

      <h3 className="plan-card-name">{name}</h3>
      <p className="plan-card-quantity">{quantity}</p>

      <div className="plan-card-price">
        <span className="plan-card-price-currency">₹</span>
        <span className="plan-card-price-amount">{price}</span>
      </div>

      <ul className="plan-card-features">
        {features.map((feature) => (
          <li key={feature}>
            <Check size={14} className="plan-card-check" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="plan-card-btn" onClick={() => onSelect?.(plan)}>
        Buy Now
      </button>
    </div>
  )
}