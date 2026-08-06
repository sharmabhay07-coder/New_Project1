import { motion } from 'framer-motion'
import { Award, Check } from 'lucide-react'
import { achievements } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function AchievementsCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
        <Award className="size-4 text-warning" /> Achievements
      </h2>

      <ul className="space-y-4">
        {achievements.map((a) => {
          const pct = Math.round((a.progress / a.target) * 100)
          return (
            <li key={a.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl',
                  a.unlocked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                )}
              >
                {a.unlocked ? <Check className="size-5" /> : <Award className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{a.title}</p>
                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {a.progress}/{a.target}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className={cn('h-full rounded-full', a.unlocked ? 'bg-primary' : 'bg-accent')}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
