import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, CheckCircle, Gift, TrendingUp, Link2 } from 'lucide-react'
import { getDashboardSummary } from '@/lib/api/userApi'
import { referral as mockReferral } from '@/lib/mock-data'

export default function ReferralsPage() {
  const [summary, setSummary] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
    if (!token) { setLoading(false); return }
    getDashboardSummary(token)
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const referralCode = summary?.referralCode || mockReferral.code
  const referralLink = `earnhub.app/r/${referralCode}`
  const invited = summary?.referredUsers || mockReferral.invited
  const target = 10

  const copy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progress = Math.min((invited / target) * 100, 100)

  const steps = [
    { step: '1', title: 'Share your link', desc: 'Send your unique referral link to friends' },
    { step: '2', title: 'Friend signs up', desc: 'They create an EarnHub account using your link' },
    { step: '3', title: 'Earn rewards', desc: 'Get $5 bonus for every friend who joins' },
  ]

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Referrals</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invite friends and earn $5 for every signup.</p>
      </div>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-primary p-8 text-white shadow-soft-primary">
        <div className="absolute -right-6 -top-6 size-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 right-24 size-20 rounded-full bg-white/10" />
        <Gift className="size-10 mb-3 text-white/80" />
        <h2 className="text-2xl font-bold">Earn $5 per Referral</h2>
        <p className="mt-1 text-sm text-white/80">Invite {target - invited > 0 ? target - invited : 0} more friends to unlock a <strong>$5 bonus</strong>!</p>
      </div>

      {/* Referral link */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3">
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm font-medium text-foreground">{referralLink}</span>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft-primary transition-transform hover:scale-105 active:scale-95"
          >
            {copied ? <CheckCircle className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Invited Friends</span>
          </div>
          <span className="text-sm font-bold tabular-nums text-foreground">{loading ? '—' : invited}/{target}</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {target - invited > 0 ? `Invite ${target - invited} more to unlock your next $5 bonus` : '🎉 Bonus unlocked!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: 'Total Invited', value: loading ? '—' : invited, icon: Users, color: 'text-primary' },
          { label: 'Bonus Earned', value: loading ? '—' : `$${(Math.floor(invited / 2) * 5).toFixed(2)}`, icon: TrendingUp, color: 'text-success' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <s.icon className={`size-5 ${s.color}`} />
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold text-foreground">How It Works</h3>
        <div className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
