import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import './theme-toggle.css'

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains('dark'))
    sync()
    document.addEventListener('themechange', sync)
    return () => document.removeEventListener('themechange', sync)
  }, [])

  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setDark(d => !d)
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="dash-theme-toggle"
    >
      {mounted && (
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 12, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="grid place-items-center"
        >
          {dark ? <Moon className="dash-size-[18px]" /> : <Sun className="dash-size-[18px]" />}
        </motion.span>
      )}
    </button>
  )
}
