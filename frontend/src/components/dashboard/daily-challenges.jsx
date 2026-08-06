import { motion } from 'framer-motion'
import { Target, Check, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

const challenges = [
  { id: 'c1', label: 'Watch 5 videos', reward: 0.5, done: true, progress: 5, target: 5 },
  { id: 'c2', label: 'Watch a Finance video', reward: 0.75, done: true, progress: 1, target: 1 },
  { id: 'c3', label: 'Reach 12 videos today', reward: 1.5, done: false, progress: 8, target: 12 },
  { id: 'c4', label: 'Invite a friend', reward: 2.0, done: false, progress: 0, target: 1 },
]

export function DailyChallenges() {
  const completed = challenges.filter((c) => c.done).length
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Target className="size-4 text-accent" /> Daily Challenges
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          {completed}/{challenges.length} done
        </span>
      </div>

      <ul className="space-y-2.5">
        {challenges.map((c) => {
          const pct = Math.round((c.progress / c.target) * 100)
          return (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3"
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-lg',
                  c.done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                )}
              >
                {c.done ? <Check className="size-4" /> : <span className="text-xs font-bold">{pct}%</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', c.done && 'text-muted-foreground line-through')}>
                  {c.label}
                </p>
                {!c.done && (
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                )}
              </div>
              <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-primary">
                <Coins className="size-3.5" />+{c.reward.toFixed(2)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
