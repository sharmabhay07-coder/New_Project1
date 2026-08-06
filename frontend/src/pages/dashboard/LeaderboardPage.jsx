import { motion } from 'framer-motion'
import { Trophy, Crown, Medal } from 'lucide-react'
import { leaderboard } from '@/lib/mock-data'

const RANK_STYLE = {
  1: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  2: { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10' },
}

export default function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Top earners this week on EarnHub.</p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-soft">
        {[top3[1], top3[0], top3[2]].map((row, i) => {
          const pos = i === 0 ? 2 : i === 1 ? 1 : 3
          const heights = ['h-20', 'h-28', 'h-16']
          return row ? (
            <motion.div
              key={row.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                {row.initials}
              </div>
              <p className="text-xs font-semibold text-foreground">{row.name}</p>
              <p className="text-xs text-muted-foreground">${row.earned}</p>
              <div className={`${heights[i]} w-20 rounded-t-2xl ${i === 1 ? 'bg-primary' : 'bg-primary/30'} flex items-start justify-center pt-2`}>
                <span className="text-xs font-bold text-white">#{pos}</span>
              </div>
            </motion.div>
          ) : null
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {leaderboard.map((row, i) => {
          const style = RANK_STYLE[row.rank]
          return (
            <motion.div
              key={row.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-4 rounded-2xl border p-4 shadow-soft transition-colors ${row.you ? 'border-primary/30 bg-primary/5' : 'border-border bg-card hover:bg-secondary/50'}`}
            >
              <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${style ? style.bg : 'bg-secondary'}`}>
                {style ? (
                  <style.icon className={`size-4 ${style.color}`} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">#{row.rank}</span>
                )}
              </div>
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-sm font-bold text-foreground">
                {row.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{row.name} {row.you && <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">You</span>}</p>
              </div>
              <p className="text-sm font-bold tabular-nums text-foreground">${row.earned}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
