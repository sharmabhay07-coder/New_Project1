import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Medal } from 'lucide-react'
import { getLeaderboard } from '@/lib/api/userApi'
import useAuth from '@/hooks/useAuth'

const RANK_STYLE = {
  1: { icon: Crown, color: 'dash-text-chart-4', bg: 'dash-bg-chart-4/10' },
  2: { icon: Medal, color: 'dash-text-muted-foreground', bg: 'dash-bg-muted' },
  3: { icon: Medal, color: 'dash-text-chart-5', bg: 'dash-bg-chart-5/10' },
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getLeaderboard(token)
      .then(res => setLeaderboard(res.data?.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const top3 = leaderboard.slice(0, 3)

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-card dash-p-5">
          <div className="dash-flex dash-items-center dash-justify-center dash-py-8">
            <div className="dash-size-8 dash-animate-spin dash-rounded-full dash-border-4 dash-border-border dash-border-t-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div>
        <h1 className="dash-text-2xl dash-font-bold dash-text-foreground">Leaderboard</h1>
        <p className="dash-mt-1 dash-text-sm dash-text-muted-foreground">Top earners this week on EarnHub.</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="dash-card dash-p-5 dash-text-center">
          <p className="dash-text-muted-foreground">No leaderboard data available yet.</p>
        </div>
      ) : (
        <>
          <div className="dash-flex dash-items-end dash-justify-center dash-gap-4 dash-rounded-3xl dash-border dash-border-border dash-bg-card dash-p-8 dash-shadow-soft">
            {[top3[1], top3[0], top3[2]].map((row, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3
              return row ? (
                <motion.div
                  key={row.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="dash-flex dash-flex-col dash-items-center dash-gap-2"
                >
                  <div className="dash-grid dash-size-12 dash-place-items-center dash-rounded-2xl dash-bg-primary/10 dash-text-lg dash-font-bold dash-text-primary">
                    {row.initials}
                  </div>
                  <p className="dash-text-xs dash-font-semibold dash-text-foreground">{row.name}</p>
                  <p className="dash-text-xs dash-text-muted-foreground">₹{row.earned?.toFixed(2)}</p>
                  <div className="dash-w-20 dash-rounded-t-2xl dash-bg-primary/30 dash-flex dash-items-start dash-justify-center dash-pt-2" style={{ height: '5rem' }}>
                    <span className="dash-text-xs dash-font-bold dash-text-primary">#{pos}</span>
                  </div>
                </motion.div>
              ) : null
            })}
          </div>

          <div className="dash-space-y-2">
            {leaderboard.map((row, i) => {
              const style = RANK_STYLE[row.rank]
              return (
                <motion.div
                  key={row.rank}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={
                    'dash-flex dash-items-center dash-gap-4 dash-rounded-2xl dash-border dash-border-border dash-bg-card dash-p-4 dash-shadow-soft ' +
                    (row.isMe ? 'dash-border-primary/30 dash-bg-primary/5' : '')
                  }
                >
                  <div className={'dash-grid dash-size-9 dash-shrink-0 dash-place-items-center dash-rounded-xl ' + (style ? style.bg : 'dash-bg-secondary')}>
                    {style ? (
                      <style.icon className={'dash-size-4 ' + style.color} />
                    ) : (
                      <span className="dash-text-sm dash-font-bold dash-text-muted-foreground">#{row.rank}</span>
                    )}
                  </div>
                  <div className="dash-grid dash-size-9 dash-shrink-0 dash-place-items-center dash-rounded-xl dash-bg-muted dash-text-sm dash-font-bold dash-text-foreground">
                    {row.initials}
                  </div>
                  <div className="dash-flex-1">
                    <p className="dash-text-sm dash-font-semibold dash-text-foreground">
                      {row.name} {row.isMe && <span className="dash-ml-1.5 dash-rounded-full dash-bg-primary/10 dash-px-2 dash-py-0.5 dash-text-[10px] dash-font-bold dash-text-primary">You</span>}
                    </p>
                  </div>
                  <p className="dash-text-sm dash-font-bold dash-tabular-nums dash-text-foreground">₹{row.earned?.toFixed(2)}</p>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
