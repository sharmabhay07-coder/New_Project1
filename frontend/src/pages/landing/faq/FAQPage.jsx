import { useState, useMemo } from 'react'
import { faqCategories, faqs } from '@/lib/utils/faqData'
import FAQItem from './FAQItem'
import './FAQPage.css'
import faqPerson from '@/assets/images/faq1.png'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(
    faqCategories[0]?.id || ''
  )
  const [openId, setOpenId] = useState(null)

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => faq.categoryId === activeCategory)
  }, [activeCategory])

  const toggleFaq = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="faq-page">
      <div className="faq-hero">

        {/* LEFT SIDE */}
        <div className="faq-main">

          <h1 className="faq-page-title">
            Frequently Asked Questions (FAQ)
          </h1>

          <p className="faq-page-subtitle">
            Everything you need to know about earning, payments, referrals,
            and business plans on EarnHub.
          </p>

          {/* CATEGORY TABS */}
          <div className="faq-category-tabs">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`faq-category-tab ${
                  activeCategory === cat.id ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setOpenId(null)
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ LIST */}
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openId === faq.id}
                  onToggle={() => toggleFaq(faq.id)}
                />
              ))
            ) : (
              <p className="faq-empty">
                No questions found in this category.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="faq-visual">
          <img
            src={faqPerson}
            alt="EarnHub FAQ"
            className="faq-person-image"
          />
        </div>

      </div>

      {/* CONTACT CARD */}
      <div className="faq-contact-card">
        <p className="faq-contact-title">
          Still have questions?
        </p>

        <p className="faq-contact-text">
          Our support team is happy to help with anything not covered here.
        </p>

        <button
          type="button"
          className="faq-contact-btn"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}