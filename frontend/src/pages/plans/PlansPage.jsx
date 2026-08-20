import { useState } from 'react'
import PlanCard from './PlanCard'
import { plansData } from './plansData'

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleChoose = (plan) => {
    setSelectedPlan(plan)

    // TODO: hook this into your actual checkout/payment flow
    console.log('Selected plan:', plan.id)
  }

  return (
    <div className="plans-page">
      <div className="plans-page-header">
        <h1 className="plans-page-title">Upgrade your plan</h1>

        <p className="plans-page-subtitle">
          Unlock faster earnings, instant withdrawals, and more.
        </p>
      </div>

      <div className="plans-grid">
        {plansData.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            onChoose={handleChoose}
          />
        ))}
      </div>

      {selectedPlan && (
        <p className="plans-selected">
          You selected <strong>{selectedPlan.name}</strong> — checkout
          integration pending.
        </p>
      )}
    </div>
  )
}