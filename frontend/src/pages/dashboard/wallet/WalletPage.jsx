import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowDownToLine, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { getDashboardSummary } from '@/lib/api/userApi'
import { createWithdrawal } from '@/lib/api/walletApi'
import useAuth from '@/hooks/useAuth'

const METHODS = ['UPI', 'Bank Transfer', 'PayPal', 'Crypto']

export default function WalletPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ amount: '', withdrawalMethod: 'UPI', accountDetails: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getDashboardSummary(token)
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
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
    <div className="dash-page">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dash-fixed dash-right-6 dash-z-50 dash-flex dash-items-center dash-gap-2 dash-rounded-2xl dash-px-4 dash-py-3 dash-text-sm dash-font-semibold dash-shadow-soft-lg"
            style={{ background: toast.type === 'success' ? 'var(--success)' : 'var(--destructive)', color: toast.type === 'success' ? 'var(--success-fg)' : 'var(--destructive-fg)' }}
          >
            {toast.type === 'success' ? <CheckCircle className="dash-size-4" /> : <XCircle className="dash-size-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dash-flex dash-items-center dash-justify-between">
        <div>
          <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Wallet</h1>
          <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Your earnings and withdrawal history.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="dash-flex dash-items-center dash-gap-2 dash-rounded-xl dash-bg-primary dash-px-4 dash-py-2.5 dash-text-sm dash-font-bold dash-text-primary-foreground dash-shadow-soft-primary dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
        >
          <ArrowDownToLine className="dash-size-4" /> Withdraw
        </button>
      </div>

      <div className="dash-relative dash-overflow-hidden dash-rounded-3xl dash-bg-gradient-to-br dash-from-primary dash-to-accent dash-p-8 dash-text-white dash-shadow-soft-primary">
        <div className="dash-absolute dash--right-8 dash--top-8 dash-size-40 dash-rounded-full dash-bg-white/10" />
        <div className="dash-absolute dash--bottom-10 dash-right-20 dash-rounded-full dash-bg-white/10" />
        <p className="dash-text-sm dash-font-medium dash-text-white/80">Available Balance</p>
        <p className="dash-mt-2 dash-text-5xl dash-font-bold dash-tabular-nums">
          {loading ? '...' : `₹${bal.toFixed(2)}`}
        </p>
        <p className="dash-mt-1 dash-text-sm dash-text-white/70">Ready to withdraw anytime</p>
      </div>

      <div className="dash-grid dash-grid-cols-1 dash-gap-4">
        {[
          { label: 'Total Earned', value: `₹${totalEarnings.toFixed(2)}`, icon: TrendingUp, color: 'dash-text-primary' },
          { label: 'Available', value: `₹${bal.toFixed(2)}`, icon: Wallet, color: 'dash-text-success' },
          { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'dash-text-warning' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle, color: 'dash-text-accent' },
        ].map((s) => (
          <div key={s.label} className="dash-card dash-p-6 dash-shadow-soft">
            <s.icon className={'dash-size-5 ' + s.color} />
            <p className="dash-mt-2 dash-text-xl dash-font-bold dash-tabular-nums dash-text-foreground">{loading ? '—' : s.value}</p>
            <p className="dash-text-xs dash-text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="dash-flex dash-items-start dash-gap-3 dash-rounded-2xl dash-border dash-border-warning/30 dash-bg-warning/10 dash-p-6">
        <AlertCircle className="dash-mt-0.5 dash-size-4 dash-shrink-0 dash-text-warning" />
        <p className="dash-text-sm dash-text-muted-foreground">
          Minimum withdrawal amount is <strong className="dash-text-foreground">₹10.00</strong>. Withdrawals are processed within 24–48 hours. Make sure your account details are correct.
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dash-fixed dash-inset-0 dash-z-50 dash-flex dash-items-center dash-justify-center dash-p-4"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="dash-w-full dash-max-w-md dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-6 dash-shadow-soft-lg"
            >
              <h2 className="dash-text-lg dash-font-bold dash-text-foreground">Request Withdrawal</h2>
              <p className="dash-mt-0.5 dash-text-sm dash-text-muted-foreground">Available: <strong className="dash-text-foreground">₹{bal.toFixed(2)}</strong></p>
              <form onSubmit={handleWithdraw} className="dash-mt-4 dash-flex dash-flex-col dash-gap-4">
                <div>
                  <label className="dash-mb-1 dash-text-xs dash-font-semibold dash-text-muted-foreground">Amount (₹)</label>
                  <input
                    type="number"
                    min="10"
                    max={bal}
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="dash-mb-1 dash-text-xs dash-font-semibold dash-text-muted-foreground">Withdrawal Method</label>
                  <select
                    value={form.withdrawalMethod}
                    onChange={e => setForm(f => ({ ...f, withdrawalMethod: e.target.value }))}
                    className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
                  >
                    {METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="dash-mb-1 dash-text-xs dash-font-semibold dash-text-muted-foreground">Account Details</label>
                  <input
                    type="text"
                    required
                    value={form.accountDetails}
                    onChange={e => setForm(f => ({ ...f, accountDetails: e.target.value }))}
                    placeholder="UPI ID / Account number / Email"
                    className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
                  />
                </div>
                <div className="dash-flex dash-gap-3 dash-pt-1">
                  <button type="button" onClick={() => setShowModal(false)} className="dash-flex-1 dash-rounded-xl dash-border dash-border-border dash-py-2.5 dash-text-sm dash-font-medium dash-text-muted-foreground dash-hover:bg-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="dash-flex-1 dash-rounded-xl dash-bg-primary dash-py-2.5 dash-text-sm dash-font-bold dash-text-primary-foreground dash-shadow-soft-primary dash-disabled:opacity-60 dash-transition-transform dash-hover:scale-105 dash-active:scale-95"
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
