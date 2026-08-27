import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ROLE_OPTIONS = ['user', 'admin', 'client']

export default function AdminUserEditModal({
  user,
  isOpen,
  onSave,
  onCancel,
  disableRole = false,
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    role: 'user',
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        role: user.role || 'user',
      })
    }
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-p-4"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={(event) => event.target === event.currentTarget && onCancel()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="dash-w-full dash-max-w-2xl dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-6 dash-shadow-soft-lg"
          >
            <form
              className="dash-space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                onSave(form)
              }}
            >
              <h2 className="dash-m-0 dash-text-lg dash-font-bold dash-text-foreground">
                Edit user
              </h2>
              <div className="dash-space-y-3">
                {[
                  ['name', 'Name', 'text'],
                  ['email', 'Email', 'email'],
                  ['mobileNumber', 'Mobile number', 'tel'],
                ].map(([name, label, type]) => (
                    <label key={name} style={{ display: 'block' }} className="dash-space-y-1">
                    <span className="dash-text-xs dash-font-semibold dash-text-muted-foreground">
                      {label}
                    </span>
                    <input
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={handleChange}
                      className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-outline-none"
                    />
                  </label>
                ))}
                    <label style={{ display: 'block' }} className="dash-space-y-1">
                      <span className="dash-text-xs dash-font-semibold dash-text-muted-foreground">
                    Role
                  </span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={disableRole}
                    className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-outline-none dash-disabled:opacity-60"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="dash-flex dash-gap-3 dash-pt-1">
                <button type="button" onClick={onCancel} className="dash-flex-1 dash-rounded-xl dash-border dash-border-border dash-py-2.5 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-secondary">
                  Cancel
                </button>
                <button type="submit" className="dash-flex-1 dash-rounded-lg dash-bg-primary dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-white dash-transition-transform dash-hover:scale-105 dash-active:scale-95">
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}