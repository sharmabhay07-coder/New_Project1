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
} from 'lucide-react'



export const navSections = [
  {
    title: 'Earn',
    items: [
      { label: 'Earn Now', icon: LayoutDashboard, href: '/dashboard', active: true },
      { label: 'Plans', icon: PlaySquare, href: '/plans' },
      { label: 'Videos', icon: PlaySquare, href: '/dashboard/videos' },
      { label: 'Tasks', icon: Target, href: '/dashboard/tasks' },
      { label: 'Referrals', icon: Users, href: '/dashboard/referrals' },
      { label: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'My Earnings', icon: TrendingUp, href: '/dashboard/wallet' },
      { label: 'Wallet', icon: Wallet, href: '/dashboard/wallet' },
      { label: 'Withdraw', icon: ArrowDownToLine, href: '/dashboard' },
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
      { label: 'B2B', icon: Users, href: '/dashboard/b2b' },
      { label: 'Settings', icon: Settings, href: '/dashboard' },
      { label: 'Support', icon: LifeBuoy, href: '/dashboard' },
    ],
  },
]
