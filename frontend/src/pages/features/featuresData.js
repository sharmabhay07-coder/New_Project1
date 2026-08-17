import {
  PlaySquare,
  Target,
  Users,
  TrendingUp,
  Wallet,
  Zap,
  LayoutDashboard,
  LifeBuoy,
} from 'lucide-react'

export const features = [
  {
    id: 'watch-earn',
    icon: PlaySquare,
    title: 'Watch & Earn',
    description: 'Earn coins by watching short videos every day — no special skills needed.',
  },
  {
    id: 'tasks',
    icon: Target,
    title: 'Complete Tasks',
    description: 'Finish simple tasks and campaigns to unlock extra rewards on top of your earnings.',
  },
  {
    id: 'referrals',
    icon: Users,
    title: 'Referral Rewards',
    description: 'Invite friends with your unique link and earn a share of what they make.',
  },
  {
    id: 'business-plans',
    icon: TrendingUp,
    title: 'Business Plans',
    description: 'Promote your videos, channel, and website with plans built for real growth.',
  },
  {
    id: 'wallet',
    icon: Wallet,
    title: 'Secure Wallet',
    description: 'Track every coin you earn in one place, with a clear history of all activity.',
  },
  {
    id: 'withdrawals',
    icon: Zap,
    title: 'Fast Withdrawals',
    description: 'Cash out your earnings quickly once you hit the minimum payout threshold.',
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    title: 'Real-Time Dashboard',
    description: 'See your earnings, tasks, and referrals update live from a single dashboard.',
  },
  {
    id: 'support',
    icon: LifeBuoy,
    title: '24/7 Support',
    description: 'Our support team is always available to help with any question, anytime.',
  },
]