import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, Check, Gift } from 'lucide-react'
import { referral, balances } from '@/lib/mock-data'

export function ReferralProgress() {
  const [copied, setCopied] = useState(false)
  const pct = Math.round((referral.invited / referral.target) * 100)

  const copy = () => {
    navigator.clipboard?.writeText(referral.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Users className="size-4 text-accent" /> Refer &amp; Earn
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
            <Gift className="size-3.5" />+{balances.currency}
            {referral.earned.toFixed(0)}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Invite {referral.target - referral.invited} more friends to unlock a{' '}
          <span className="font-semibold text-foreground">{balances.currency}5 bonus</span>.
        </p>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Invited friends</span>
            <span className="font-semibold tabular-nums">
              {referral.invited}/{referral.target}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 pl-3">
          <span className="flex-1 truncate font-mono text-sm text-muted-foreground">
            {referral.link}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
