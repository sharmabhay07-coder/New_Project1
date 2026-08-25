import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import './FAQItem.css'

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        type="button"
        className="faq-item-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown size={18} className="faq-item-chevron" />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-item-answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <p className="faq-item-answer">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}