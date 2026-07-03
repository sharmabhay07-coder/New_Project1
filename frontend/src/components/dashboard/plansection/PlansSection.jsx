import './PlansSection.css';

const PLANS = [
  {
    id: 'basic',
    icon: '⚡',
    name: 'Basic',
    sub: 'Free Plan',
    price: '$0',
    period: '',
    color: '#10b981',
    features: ['Daily Video Tasks', 'Limited Withdrawals', 'Standard Support'],
    current: true,
    btnLabel: 'Current Plan',
    btnStyle: 'outline',
  },
  {
    id: 'pro',
    icon: '👑',
    name: 'Pro',
    sub: '/month',
    price: '$9.99',
    period: '/mo',
    color: '#f59e0b',
    features: ['All Task Types', 'Higher Daily Earnings', 'Priority Support', 'Fast Withdraw'],
    current: false,
    btnLabel: 'Upgrade Now',
    btnStyle: 'solid',
  },
  {
    id: 'premium',
    icon: '💎',
    name: 'Premium',
    sub: '/month',
    price: '$19.99',
    period: '/mo',
    color: '#8b5cf6',
    features: ['All Pro Features', 'Exclusive Tasks', 'Highest Earnings', '24/7 Support'],
    current: false,
    btnLabel: 'Upgrade Now',
    btnStyle: 'solid',
  },
];

export default function PlansSection() {
  return (
    <div className="pl-wrap">
      <div className="pl-head">
        <h2 className="pl-title">Plans Section</h2>
        <button className="pl-view-all">View All Plans</button>
      </div>

      <div className="pl-list">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`pl-card ${plan.current ? 'current' : ''}`}
            style={plan.current ? { borderColor: plan.color } : {}}
          >
            <div className="pl-card-head">
              <div className="pl-card-icon">{plan.icon}</div>
              <div className="pl-card-info">
                <div className="pl-card-name">{plan.name}</div>
                <div className="pl-card-sub">{plan.sub}</div>
              </div>
              <div
                className="pl-card-price"
                style={{ color: plan.color }}
              >
                {plan.price}
              </div>
            </div>

            <div className="pl-card-features">
              {plan.features.map((f) => (
                <div key={f} className="pl-card-feature">
                  <span
                    className="pl-card-check"
                    style={{ color: plan.color }}
                  >
                    ✓
                  </span>
                  {f}
                </div>
              ))}
            </div>

            <button
              className={`pl-card-btn ${plan.btnStyle}`}
              style={
                plan.btnStyle === 'solid'
                  ? { background: plan.color }
                  : { borderColor: plan.color, color: plan.color }
              }
            >
              {plan.btnLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}