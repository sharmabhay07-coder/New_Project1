import { Trophy, ChevronRight } from 'lucide-react'
import { leaderboard, balances } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const medal = ['text-warning', 'text-muted-foreground', 'text-chart-4']

export function LeaderboardPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Trophy className="size-4 text-warning" /> Leaderboard
        </h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary">
          Full ranking <ChevronRight className="size-3.5" />
        </button>
      </div>

      <ul className="space-y-2">
        {leaderboard.map((row) => (
          <li
            key={row.rank}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5',
              row.you ? 'border border-primary/30 bg-primary/[0.07]' : 'bg-secondary/40',
            )}
          >
            <span
              className={cn(
                'w-6 text-center text-sm font-bold tabular-nums',
                row.rank <= 3 ? medal[row.rank - 1] : 'text-muted-foreground',
              )}
            >
              {row.rank}
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold">
              {row.initials}
            </span>
            <span className="flex-1 text-sm font-medium">
              {row.name}
              {row.you && <span className="ml-1.5 text-[10px] font-bold text-primary">YOU</span>}
            </span>
            <span className="text-sm font-bold tabular-nums text-primary">
              {balances.currency}
              {row.earned.toFixed(0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
