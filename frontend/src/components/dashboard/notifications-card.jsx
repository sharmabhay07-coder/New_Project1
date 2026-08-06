import { Coins, ArrowDownToLine, PlaySquare, Users, Megaphone } from 'lucide-react'
import { notifications } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const config = {
  reward: { icon: Coins, className: 'bg-primary/12 text-primary' },
  withdraw: { icon: ArrowDownToLine, className: 'bg-accent/12 text-accent' },
  video: { icon: PlaySquare, className: 'bg-chart-3/12 text-chart-3' },
  referral: { icon: Users, className: 'bg-warning/12 text-warning' },
  announcement: { icon: Megaphone, className: 'bg-chart-5/12 text-chart-5' },
}

export function NotificationsCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent Activity</h2>
        <button className="text-xs font-medium text-primary">Mark all read</button>
      </div>

      <ul className="space-y-1">
        {notifications.map((n) => {
          const { icon: Icon, className } = config[n.type]
          return (
            <li
              key={n.id}
              className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-secondary/50"
            >
              <span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg', className)}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-pretty">{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {n.unread && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
