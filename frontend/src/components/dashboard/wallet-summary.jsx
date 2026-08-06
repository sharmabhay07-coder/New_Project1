import { motion } from 'framer-motion'
import { ArrowDownToLine, TrendingUp, Clock, Wallet } from 'lucide-react'
import { balances } from '@/lib/mock-data'
import { AnimatedCounter } from './animated-counter'

const rows = [
  { label: "Today's earnings", value: balances.today, icon: TrendingUp, tone: 'text-accent' },
  { label: 'Pending', value: balances.pending, icon: Clock, tone: 'text-warning' },
]

export function WalletSummary() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Balance header */}
      <div className="relative overflow-hidden bg-primary p-5 text-primary-foreground">
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <Wallet className="size-4" /> Available balance
          </div>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            <AnimatedCounter value={balances.withdrawable} prefix={balances.currency} decimals={2} />
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-foreground py-2.5 text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
          >
            <ArrowDownToLine className="size-4" /> Withdraw
          </motion.button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="divide-y divide-border">
        {rows.map((r) => {
          const Icon = r.icon
          return (
            <div key={r.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className={`size-4 ${r.tone}`} />
                {r.label}
              </span>
              <span className="text-sm font-bold tabular-nums">
                {balances.currency}
                {r.value.toFixed(2)}
              </span>
            </div>
          )
        })}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-muted-foreground">Lifetime balance</span>
          <span className="text-sm font-bold tabular-nums text-primary">
            {balances.currency}
            {balances.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
