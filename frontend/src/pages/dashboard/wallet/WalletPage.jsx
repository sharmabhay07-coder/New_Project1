import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowDownToLine, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { getDashboardSummary } from '@/lib/api/userApi'
import { createWithdrawal } from '@/lib/api/walletApi'

const METHODS = ['UPI', 'Bank Transfer', 'PayPal', 'Crypto']

export default function WalletPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ amount: '', withdrawalMethod: 'UPI', accountDetails: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('earnhub_token')
    if (!token) { setLoading(false); return }
    getDashboardSummary(token)
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('earnhub_token')
    if (!token) return showToast('Please login first', 'error')
    setSubmitting(true)
    try {
      await createWithdrawal(token, {
        amount: parseFloat(form.amount),
        withdrawalMethod: form.withdrawalMethod,
        accountDetails: form.accountDetails,
      })
      setShowModal(false)
      showToast('Withdrawal request submitted!')
      setForm({ amount: '', withdrawalMethod: 'UPI', accountDetails: '' })
    } catch (err) {
      showToast(err.message || 'Withdrawal failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const bal = summary?.balance ?? 0
  const totalEarnings = summary?.totalEarnings ?? 0
  const pendingTasks = summary?.pendingTasks ?? 0
  const completedTasks = summary?.completedTasks ?? 0

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed right-6 top-20 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-soft-lg ${toast.type === 'success' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your earnings and withdrawal history.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft-primary transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowDownToLine className="size-4" /> Withdraw
        </button>
      </div>

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-white shadow-soft-primary">
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-20 size-24 rounded-full bg-white/10" />
        <p className="text-sm font-medium text-white/80">Available Balance</p>
        <p className="mt-2 text-5xl font-bold tabular-nums">
          ${loading ? '...' : bal.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-white/70">Ready to withdraw anytime</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Earned', value: `$${totalEarnings.toFixed(2)}`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Available', value: `$${bal.toFixed(2)}`, icon: Wallet, color: 'text-success' },
          { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'text-warning' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle, color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <s.icon className={`size-5 ${s.color}`} />
            <p className="mt-2 text-xl font-bold tabular-nums text-foreground">{loading ? '—' : s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-6">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />
        <p className="text-sm text-muted-foreground">
          Minimum withdrawal amount is <strong className="text-foreground">$10.00</strong>. Withdrawals are processed within 24–48 hours. Make sure your account details are correct.
        </p>
      </div>

      {/* Withdrawal modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft-lg"
            >
              <h2 className="text-lg font-bold text-foreground">Request Withdrawal</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Available: <strong className="text-foreground">${bal.toFixed(2)}</strong></p>
              <form onSubmit={handleWithdraw} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Amount ($)</label>
                  <input
                    type="number"
                    min="10"
                    max={bal}
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Withdrawal Method</label>
                  <select
                    value={form.withdrawalMethod}
                    onChange={e => setForm(f => ({ ...f, withdrawalMethod: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Account Details</label>
                  <input
                    type="text"
                    required
                    value={form.accountDetails}
                    onChange={e => setForm(f => ({ ...f, accountDetails: e.target.value }))}
                    placeholder="UPI ID / Account number / Email"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-soft-primary disabled:opacity-60 transition-transform hover:scale-105 active:scale-95"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Withdrawal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
