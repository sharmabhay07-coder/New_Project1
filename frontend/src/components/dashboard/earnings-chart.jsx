import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { weeklyEarnings, balances } from '@/lib/mock-data'

const total = weeklyEarnings.reduce((sum, d) => sum + d.amount, 0)

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm shadow-soft-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-primary tabular-nums">
        {balances.currency}
        {payload[0].value.toFixed(2)}
      </p>
    </div>
  )
}

export function EarningsChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">Weekly Earnings</h2>
          <p className="text-xs text-muted-foreground">Your earnings analytics over the last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">
            {balances.currency}
            {total.toFixed(2)}
          </p>
          <p className="text-[11px] font-semibold text-primary">+18% vs last week</p>
        </div>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyEarnings} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)' }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#earnFill)"
              dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--color-primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
