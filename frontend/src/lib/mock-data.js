export const user = {
  name: 'Aarav',
  fullName: 'Aarav Sharma',
  handle: '@aarav',
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 6,
  avatarInitials: 'AS',
}

export const balances = {
  total: 148.62,
  today: 6.4,
  pending: 12.75,
  withdrawable: 121.5,
  currency: '$',
}

export const todayGoal = {
  target: 10,
  earned: 6.4,
  videosWatched: 8,
  videosTarget: 12,
}

export const weeklyEarnings = [
  { day: 'Mon', amount: 8.2 },
  { day: 'Tue', amount: 5.6 },
  { day: 'Wed', amount: 11.4 },
  { day: 'Thu', amount: 7.1 },
  { day: 'Fri', amount: 9.8 },
  { day: 'Sat', amount: 12.9 },
  { day: 'Sun', amount: 6.4 },
]

export const continueWatching = [
  {
    id: 'v1',
    title: 'How Compound Interest Builds Real Wealth',
    creator: 'MoneyMinded',
    verified: true,
    category: 'Finance',
    thumbnail: '/thumbnails/finance.png',
    reward: 0.85,
    duration: '4:20',
    durationSeconds: 260,
    difficulty: 'Easy',
    views: '1.2M',
    progress: 62,
    completed: false,
  },
  {
    id: 'v2',
    title: 'The 2026 Flagship Phone Everyone Is Talking About',
    creator: 'TechPulse',
    verified: true,
    category: 'Technology',
    thumbnail: '/thumbnails/tech.png',
    reward: 1.2,
    duration: '6:05',
    durationSeconds: 365,
    difficulty: 'Medium',
    views: '842K',
    progress: 34,
    completed: false,
  },
]

export const featuredVideos = [
  {
    id: 'f1',
    title: 'Hidden Mountain Trails You Have To See Before You Die',
    creator: 'Wander',
    verified: true,
    category: 'Travel',
    thumbnail: '/thumbnails/travel.png',
    reward: 1.5,
    duration: '7:12',
    durationSeconds: 432,
    difficulty: 'Medium',
    views: '2.4M',
    progress: 0,
    completed: false,
  },
  {
    id: 'f2',
    title: '15-Minute Full Body Workout, No Equipment',
    creator: 'FitForge',
    verified: true,
    category: 'Fitness',
    thumbnail: '/thumbnails/fitness.png',
    reward: 0.95,
    duration: '5:40',
    durationSeconds: 340,
    difficulty: 'Easy',
    views: '980K',
    progress: 0,
    completed: false,
  },
  {
    id: 'f3',
    title: 'The Perfect Weeknight Dinner In Under 20 Minutes',
    creator: 'PlateUp',
    verified: false,
    category: 'Cooking',
    thumbnail: '/thumbnails/cooking.png',
    reward: 1.1,
    duration: '6:50',
    durationSeconds: 410,
    difficulty: 'Easy',
    views: '654K',
    progress: 0,
    completed: false,
  },
  {
    id: 'f4',
    title: 'Ranking Every Controller From Worst To Best',
    creator: 'GG Central',
    verified: true,
    category: 'Gaming',
    thumbnail: '/thumbnails/gaming.png',
    reward: 1.35,
    duration: '8:30',
    durationSeconds: 510,
    difficulty: 'Hard',
    views: '1.7M',
    progress: 0,
    completed: false,
  },
]

export const recentlyWatched = [
  {
    id: 'r1',
    title: 'Budgeting Rules That Actually Work',
    creator: 'MoneyMinded',
    verified: true,
    category: 'Finance',
    thumbnail: '/thumbnails/finance.png',
    reward: 0.75,
    duration: '3:50',
    durationSeconds: 230,
    difficulty: 'Easy',
    views: '540K',
    progress: 100,
    completed: true,
  },
  {
    id: 'r2',
    title: 'Best Budget Laptops For Students',
    creator: 'TechPulse',
    verified: true,
    category: 'Technology',
    thumbnail: '/thumbnails/tech.png',
    reward: 0.9,
    duration: '5:10',
    durationSeconds: 310,
    difficulty: 'Medium',
    views: '410K',
    progress: 100,
    completed: true,
  },
]

export const leaderboard = [
  { rank: 1, name: 'Priya K.', initials: 'PK', earned: 482.4 },
  { rank: 2, name: 'Diego M.', initials: 'DM', earned: 451.1 },
  { rank: 3, name: 'Sara L.', initials: 'SL', earned: 398.9 },
  { rank: 14, name: 'You', initials: 'AS', earned: 148.62, you: true },
]

export const achievements = [
  {
    id: 'a1',
    title: 'Weekend Warrior',
    description: 'Watch 20 videos this weekend',
    progress: 14,
    target: 20,
    unlocked: false,
  },
  {
    id: 'a2',
    title: 'First Payout',
    description: 'Complete your first withdrawal',
    progress: 1,
    target: 1,
    unlocked: true,
  },
  {
    id: 'a3',
    title: 'Streak Master',
    description: 'Maintain a 7 day streak',
    progress: 6,
    target: 7,
    unlocked: false,
  },
]

export const notifications = [
  {
    id: 'n1',
    type: 'reward',
    title: 'You earned $1.20 for watching "The 2026 Flagship Phone"',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'referral',
    title: 'Neha joined using your referral link',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'withdraw',
    title: 'Your $50.00 withdrawal to UPI was approved',
    time: '5h ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'video',
    title: '32 new videos are available in Finance',
    time: 'Yesterday',
    unread: false,
  },
]

export const referral = {
  code: 'AARAV2026',
  link: 'earnhub.app/r/AARAV2026',
  invited: 8,
  target: 10,
  earned: 24.5,
}
