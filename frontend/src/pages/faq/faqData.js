export const faqCategories = [
  { id: 'getting-started',   label: 'Getting Started' },
  { id: 'earning-payments',  label: 'Earning & Payments' },
  { id: 'referrals',         label: 'Referrals' },
  { id: 'business-plans',    label: 'Business Plans' },
  { id: 'account-security',  label: 'Account & Security' },
]

export const faqs = [
  // ── Getting Started ──────────────────────────────────────
  { id: 'gs-1', categoryId: 'getting-started', question: 'What is EarnHub?',
    answer: 'EarnHub is a platform where you earn rewards by watching videos, completing simple tasks, and referring friends. Business owners can also use EarnHub to promote their videos, channels, and websites through our plans.' },
  { id: 'gs-2', categoryId: 'getting-started', question: 'How do I create an account?',
    answer: 'Click the Register button on the homepage, fill in your name, email, and password, and verify your email to get started. It takes less than two minutes.' },
  { id: 'gs-3', categoryId: 'getting-started', question: 'Is EarnHub free to join?',
    answer: 'Yes, joining EarnHub as an earner is completely free. Business owners only pay when they purchase a promotion plan.' },

  // ── Earning & Payments ───────────────────────────────────
  { id: 'ep-1', categoryId: 'earning-payments', question: 'How much can I earn per video?',
    answer: 'Earnings vary by video length and campaign, but most videos pay a fixed reward in coins once you watch the full duration.' },
  { id: 'ep-2', categoryId: 'earning-payments', question: 'How do I withdraw my earnings?',
    answer: 'Go to your Wallet from the dashboard, choose a withdrawal method, and enter your payout details. Withdrawals are processed within a few business days after reaching the minimum payout threshold.' },
  { id: 'ep-3', categoryId: 'earning-payments', question: 'What is the minimum withdrawal amount?',
    answer: 'The minimum withdrawal amount is shown on your Wallet page and may vary depending on your payout method.' },
  { id: 'ep-4', categoryId: 'earning-payments', question: 'Why is my earning pending?',
    answer: 'Earnings stay pending for a short verification window to confirm genuine activity before they are added to your withdrawable balance.' },

  // ── Referrals ────────────────────────────────────────────
  { id: 'ref-1', categoryId: 'referrals', question: 'How does the referral program work?',
    answer: 'Share your unique referral link with friends. When they sign up and start earning, you receive a percentage of their earnings as a bonus, at no extra cost to them.' },
  { id: 'ref-2', categoryId: 'referrals', question: 'Is there a limit to how many people I can refer?',
    answer: 'No, there is no cap. You can refer as many people as you like and continue earning from each active referral.' },

  // ── Business Plans ───────────────────────────────────────
  { id: 'bp-1', categoryId: 'business-plans', question: 'What can I promote with a plan?',
    answer: 'You can promote video views, channel subscribers, likes, Google reviews, website ranking, and website visits through our plan categories.' },
  { id: 'bp-2', categoryId: 'business-plans', question: 'How long does delivery take?',
    answer: 'Delivery time depends on the plan and is listed on each plan card, typically ranging from 24 hours to a couple of weeks for larger orders.' },
  { id: 'bp-3', categoryId: 'business-plans', question: 'Do I need to share my account password?',
    answer: 'No. Most plans do not require your password — we only need the public link (video, channel, website, or listing) you want to promote.' },

  // ── Account & Security ───────────────────────────────────
  { id: 'as-1', categoryId: 'account-security', question: 'I forgot my password. What do I do?',
    answer: 'Click Forgot Password on the login page and follow the instructions sent to your registered email to reset it.' },
  { id: 'as-2', categoryId: 'account-security', question: 'Can I use one account on multiple devices?',
    answer: 'Yes, you can log into your EarnHub account from any device. For security, avoid sharing your login credentials with others.' },
  { id: 'as-3', categoryId: 'account-security', question: 'How do I delete my account?',
    answer: 'Contact our support team from the Help section in your dashboard settings, and we will process your account deletion request within a few business days.' },
]