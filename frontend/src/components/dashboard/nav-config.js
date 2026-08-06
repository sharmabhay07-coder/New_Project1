import {
  LayoutDashboard,
  PlaySquare,
  Wallet,
  ArrowDownToLine,
  Users,
  Trophy,
  Gift,
  Target,
  Bell,
  Upload,
  Settings,
  LifeBuoy,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  href: string
  badge?: string
  active?: boolean
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: 'Earn',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
      { label: 'Watch Videos', icon: PlaySquare, href: '/dashboard', badge: 'New' },
      { label: 'Daily Challenges', icon: Target, href: '/dashboard' },
      { label: 'Rewards', icon: Gift, href: '/dashboard' },
      { label: 'Leaderboard', icon: Trophy, href: '/dashboard' },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'My Earnings', icon: TrendingUp, href: '/dashboard' },
      { label: 'Wallet', icon: Wallet, href: '/dashboard' },
      { label: 'Withdraw', icon: ArrowDownToLine, href: '/dashboard' },
      { label: 'Referrals', icon: Users, href: '/dashboard' },
    ],
  },
  {
    title: 'Creator',
    items: [
      { label: 'Upload Video', icon: Upload, href: '/dashboard' },
      { label: 'Notifications', icon: Bell, href: '/dashboard', badge: '2' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', icon: Settings, href: '/dashboard' },
      { label: 'Support', icon: LifeBuoy, href: '/dashboard' },
    ],
  },
]
