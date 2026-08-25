import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, LifeBuoy, ChevronRight, CheckCircle } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import './SettingsPage.css'

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
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobileNumber || '',
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
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Settings</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Manage your account preferences.</p>
      </div>

      <form onSubmit={save} className="dash-card dash-p-5 dash-shadow-soft dash-space-y-4">
        <div className="dash-flex dash-items-center dash-gap-2">
          <User className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Profile Information</h2>
        </div>
        {SECTIONS[0].fields.map(f => (
          <div key={f.key}>
            <label className="dash-mb-1 dash-text-xs dash-font-semibold dash-text-muted-foreground">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
              className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-focus:ring-2 dash-focus:ring-primary/20"
            />
          </div>
        ))}
        <button
          type="submit"
          className="dash-flex dash-items-center dash-gap-2 dash-rounded-xl dash-bg-primary dash-px-4 dash-py-2.5 dash-text-sm dash-font-bold dash-text-primary-foreground dash-shadow-soft-primary dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
        >
          {saved ? <><CheckCircle className="dash-size-4" /> Saved!</> : 'Save Changes'}
        </button>
      </form>

      <div className="dash-card dash-p-5 dash-shadow-soft dash-space-y-4">
        <div className="dash-flex dash-items-center dash-gap-2">
          <Bell className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Notifications</h2>
        </div>
        {TOGGLES.map(t => (
          <div key={t.key} className="dash-flex dash-items-center dash-justify-between">
            <div>
              <p className="dash-text-sm dash-font-medium dash-text-foreground">{t.label}</p>
              <p className="dash-text-xs dash-text-muted-foreground">{t.desc}</p>
            </div>
            <button
              onClick={() => setToggles(v => ({ ...v, [t.key]: !v[t.key] }))}
              className={'dash-relative dash-h-4 dash-w-11 dash-rounded-full dash-transition-colors ' + (toggles[t.key] ? 'dash-bg-primary' : 'dash-bg-border')}
            >
              <motion.span
                layout
                className="dash-absolute dash-size-5 dash-rounded-full dash-bg-white"
                animate={{ x: toggles[t.key] ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="dash-card dash-p-5 dash-shadow-soft">
        <div className="dash-flex dash-items-center dash-gap-2 dash-mb-3">
          <Shield className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Security</h2>
        </div>
        {['Change Password', 'Two-Factor Authentication', 'Active Sessions'].map(item => (
          <button key={item} className="dash-flex dash-w-full dash-items-center dash-justify-between dash-py-3 settings-list-item dash-text-sm dash-text-foreground dash-transition-colors">
            {item}
            <ChevronRight className="dash-size-4 dash-text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="dash-card dash-p-5 dash-shadow-soft">
        <div className="dash-flex dash-items-center dash-gap-2 dash-mb-3">
          <LifeBuoy className="dash-size-4 dash-text-primary" />
          <h2 className="dash-text-sm dash-font-bold dash-text-foreground">Help &amp; Support</h2>
        </div>
        {['FAQs', 'Contact Support', 'Report a Bug', 'Terms &amp; Privacy'].map(item => (
          <button key={item} className="dash-flex dash-w-full dash-items-center dash-justify-between dash-py-3 settings-list-item dash-text-sm dash-text-foreground dash-transition-colors">
            {item}
            <ChevronRight className="dash-size-4 dash-text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}