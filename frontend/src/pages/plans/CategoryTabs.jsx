import './CategoryTabs.css'

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`category-tab${active === cat.id ? ' active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}