import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, CreditCard, Moon, LifeBuoy, ChevronRight, CheckCircle } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Profile',
    icon: User,
    fields: [
      { label: 'Full Name', type: 'text', placeholder: 'Your name', key: 'name' },
      { label: 'Email', type: 'email', placeholder: 'your@email.com', key: 'email' },
      { label: 'Phone', type: 'tel', placeholder: '+91 00000 00000', key: 'phone' },
    ],
  },
]

const TOGGLES = [
  { label: 'Email Notifications', desc: 'Receive earning updates via email', key: 'email_notif' },
  { label: 'Push Notifications', desc: 'Get browser alerts for new videos', key: 'push_notif' },
  { label: 'Referral Alerts', desc: 'Notify when a friend signs up', key: 'referral_alert' },
]

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: localStorage.getItem('earnhub_name') || '',
    email: '',
    phone: '',
  })
  const [toggles, setToggles] = useState({ email_notif: true, push_notif: false, referral_alert: true })
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    if (form.name) localStorage.setItem('earnhub_name', form.name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      {/* Profile form */}
      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Profile Information</h2>
        </div>
        {SECTIONS[0].fields.map(f => (
          <div key={f.key}>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft-primary transition-transform hover:scale-105 active:scale-95"
        >
          {saved ? <><CheckCircle className="size-4" /> Saved!</> : 'Save Changes'}
        </button>
      </form>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Notifications</h2>
        </div>
        {TOGGLES.map(t => (
          <div key={t.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
            <button
              onClick={() => setToggles(v => ({ ...v, [t.key]: !v[t.key] }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${toggles[t.key] ? 'bg-primary' : 'bg-border'}`}
            >
              <motion.span
                layout
                className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow"
                animate={{ x: toggles[t.key] ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Security</h2>
        </div>
        {['Change Password', 'Two-Factor Authentication', 'Active Sessions'].map(item => (
          <button key={item} className="flex w-full items-center justify-between py-3 border-b border-border last:border-0 text-sm text-foreground hover:text-primary transition-colors">
            {item}
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Support */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <LifeBuoy className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Help & Support</h2>
        </div>
        {['FAQs', 'Contact Support', 'Report a Bug', 'Terms & Privacy'].map(item => (
          <button key={item} className="flex w-full items-center justify-between py-3 border-b border-border last:border-0 text-sm text-foreground hover:text-primary transition-colors">
            {item}
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}
