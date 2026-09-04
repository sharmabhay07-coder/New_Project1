import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, CheckCircle, Gift, TrendingUp, Link2, ShieldCheck } from 'lucide-react'
import { getDashboardSummary } from '@/lib/api/userApi'
import useAuth from '@/hooks/useAuth'

export default function ReferralsPage() {
  const [summary, setSummary] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getDashboardSummary(token)
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [token])

  const referralCode = summary?.referralCode || ''
  const referralLink = referralCode ? `earnhub.app/r/${referralCode}` : ''
  const invited = summary?.referredUsers || 0
  const target = 10
  const bonusEarned = invited * 5

  const copy = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progress = Math.min((invited / target) * 100, 100)

  return (
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Referrals</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Invite friends and earn ₹5 for every signup.</p>
      </div>

      <div className="dash-relative dash-overflow-hidden dash-rounded-3xl dash-bg-gradient-to-br dash-from-accent dash-to-primary dash-p-8 dash-text-white dash-shadow-soft-primary">
        <div className="dash-absolute dash--right-6 dash--top-6 dash-size-36 dash-rounded-full dash-bg-white/10" />
        <Gift className="dash-size-10 dash-mb-3 dash-text-white/80" />
        <h2 className="dash-text-2xl dash-font-bold">Earn ₹5 per Referral</h2>
        <p className="dash-mt-1 dash-text-sm dash-text-white/80">Invite {Math.max(0, target - invited)} more friends to unlock your next bonus!</p>
      </div>

      <div className="dash-rounded-2xl dash-border dash-border-border dash-bg-card dash-p-5 dash-shadow-soft">
        <p className="dash-mb-2 dash-text-xs dash-font-semibold dash-uppercase dash-tracking-widest dash-text-muted-foreground">Your Referral Link</p>
        <div className="dash-flex dash-flex-wrap dash-items-stretch dash-gap-3">
          <div className="dash-flex dash-flex-1 dash-min-w-0 dash-items-center dash-gap-2 dash-rounded-xl dash-border dash-border-border dash-bg-secondary dash-px-4 dash-py-3">
            <Link2 className="dash-size-4 dash-shrink-0 dash-text-muted-foreground" />
            <span className="dash-flex-1 dash-truncate dash-font-mono dash-text-sm dash-text-foreground">{referralLink || 'Loading...'}</span>
          </div>
          <button
            onClick={copy}
            disabled={!referralLink}
            className="dash-flex dash-shrink-0 dash-items-center dash-justify-center dash-gap-1.5 dash-rounded-xl dash-bg-primary dash-px-6 dash-py-3 dash-text-sm dash-font-bold dash-text-primary-foreground dash-shadow-soft-primary dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
          >
            {copied ? <CheckCircle className="dash-size-4" /> : <Copy className="dash-size-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="dash-rounded-2xl dash-border dash-border-border dash-bg-card dash-p-5 dash-shadow-soft">
        <div className="dash-flex dash-items-center dash-justify-between dash-mb-3">
          <div className="dash-flex dash-items-center dash-gap-2">
            <Users className="dash-size-4 dash-text-primary" />
            <span className="dash-text-sm dash-font-semibold dash-text-foreground">Invited Friends</span>
          </div>
          <span className="dash-text-sm dash-font-bold dash-tabular-nums dash-text-foreground">{loading ? '—' : invited}/{target}</span>
        </div>
        <div className="dash-h-2.5 dash-w-full dash-overflow-hidden dash-rounded-full dash-bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="dash-h-full dash-rounded-full dash-bg-primary"
          />
        </div>
        <p className="dash-mt-2 dash-text-xs dash-text-muted-foreground">
          {target - invited > 0 ? `Invite ${target - invited} more to unlock your next bonus` : 'Bonus unlocked!'}
        </p>
      </div>

      <div className="dash-grid dash-grid-cols-1 dash-md:grid-cols-2 dash-gap-4">
        {[
          { label: 'Total Invited', value: loading ? '—' : invited, icon: Users, color: 'dash-text-primary' },
          { label: 'Bonus Earned', value: loading ? '—' : `₹${bonusEarned.toFixed(2)}`, icon: TrendingUp, color: 'dash-text-success' },
        ].map(s => (
          <div key={s.label} className="dash-card dash-p-5 dash-shadow-soft">
            <s.icon className={'dash-size-5 ' + s.color} />
            <p className="dash-mt-2 dash-text-2xl dash-font-bold dash-tabular-nums dash-text-foreground">{s.value}</p>
            <p className="dash-text-xs dash-text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="dash-rounded-2xl dash-border dash-border-border dash-bg-card dash-p-5 dash-shadow-soft">
        <div className="dash-flex dash-items-center dash-gap-2 dash-mb-3">
          <ShieldCheck className="dash-size-4 dash-text-primary" />
          <span className="dash-text-sm dash-font-semibold dash-text-foreground">Terms &amp; Conditions</span>
        </div>
        <ul className="dash-flex dash-flex-col dash-gap-2 dash-text-xs dash-text-muted-foreground dash-list-disc dash-pl-4">
          <li>Referral bonus is credited only after the referred user signs up and completes their first task or video.</li>
          <li>Self-referrals or multiple accounts from the same device or IP are not eligible for rewards.</li>
          <li>EarnHub reserves the right to withhold or reverse referral earnings in case of fraudulent activity.</li>
          <li>Referral reward amount and milestone bonuses may change at any time without prior notice.</li>
          <li>Withdrawal of referral earnings follows the same rules as your regular wallet balance.</li>
        </ul>
      </div>
    </div>
  )
}