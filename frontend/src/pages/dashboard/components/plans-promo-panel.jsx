import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import "./plans-promo-panel.css";

const promoPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹499",
    tag: "Popular",
    perk: "2x faster earnings",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    tag: "Best Value",
    perk: "Instant withdrawals",
  },
  {
    id: "business",
    name: "Business",
    price: "₹2499",
    tag: "For Teams",
    perk: "Bulk promotion tools",
  },
];

export default function PlansPromoPanel() {
  return (
    <motion.aside
      className="plans-promo-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="plans-promo-header">
        <Sparkles size={18} />
        <h4>Upgrade & Earn More</h4>
      </div>

      <div className="plans-promo-list">
        {promoPlans.map((plan) => (
          <Link
            to={`/dashboard/plans?plan=${plan.id}`}
            key={plan.id}
            className="plans-promo-card"
          >
            <span className="plans-promo-tag">{plan.tag}</span>

            <h5>{plan.name}</h5>

            <p className="plans-promo-price">
              {plan.price}
              <span>/mo</span>
            </p>

            <p className="plans-promo-perk">{plan.perk}</p>

            <span className="plans-promo-cta">
              View Plan <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}