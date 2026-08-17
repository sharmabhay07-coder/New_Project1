import { useState } from 'react'
import { categories, plans } from './plansData'
import CategoryTabs from './CategoryTabs'
import PlanCard from './PlanCard'
import './PlansPage.css'

export default function PlansPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  const filteredPlans = plans.filter((plan) => plan.categoryId === activeCategory)

  const handleSelectPlan = (plan) => {
    // TODO: wire this to your checkout / payment flow
    console.log('Selected plan:', plan)
  }

  return (
    <div className="plans-page">
      <div className="plans-page-header">
        <h1 className="plans-page-title">Grow Your Business</h1>
        <p className="plans-page-subtitle">
          Choose a plan to boost your video views, subscribers, reviews, and website traffic.
        </p>
      </div>

      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="plans-grid">
        {filteredPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
        ))}
      </div>
    </div>
  )
}