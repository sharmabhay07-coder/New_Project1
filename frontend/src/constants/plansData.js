export const categories = [
  { id: 'video-views',     label: 'Video Views' },
  { id: 'subscribers',     label: 'Subscribers' },
  { id: 'likes',           label: 'Likes' },
  { id: 'google-review',   label: 'Google Reviews' },
  { id: 'website-ranking', label: 'Website Ranking' },
  { id: 'website-visits',  label: 'Website Visits' },
]

export const plans = [
  // ── Video Views ──────────────────────────────────────────
  { id: 'vv-starter', categoryId: 'video-views', name: 'Starter', price: 299, quantity: '1,000 Views',
    features: ['Real active viewers', 'Delivery in 24–48 hrs', 'No password required'], popular: false },
  { id: 'vv-growth', categoryId: 'video-views', name: 'Growth', price: 799, quantity: '5,000 Views',
    features: ['Real active viewers', 'Delivery in 24–48 hrs', 'Retention boost', 'Priority support'], popular: true },
  { id: 'vv-pro', categoryId: 'video-views', name: 'Pro', price: 1499, quantity: '12,000 Views',
    features: ['Real active viewers', 'Delivery in 48–72 hrs', 'Retention boost', 'Priority support', 'Dedicated manager'], popular: false },

  // ── Subscribers ──────────────────────────────────────────
  { id: 'sub-starter', categoryId: 'subscribers', name: 'Starter', price: 399, quantity: '200 Subscribers',
    features: ['Real accounts', 'Gradual delivery', 'No password required'], popular: false },
  { id: 'sub-growth', categoryId: 'subscribers', name: 'Growth', price: 999, quantity: '600 Subscribers',
    features: ['Real accounts', 'Gradual delivery', 'Retention guarantee', 'Priority support'], popular: true },
  { id: 'sub-pro', categoryId: 'subscribers', name: 'Pro', price: 1899, quantity: '1,500 Subscribers',
    features: ['Real accounts', 'Gradual delivery', 'Retention guarantee', 'Priority support', 'Dedicated manager'], popular: false },

  // ── Likes ────────────────────────────────────────────────
  { id: 'like-starter', categoryId: 'likes', name: 'Starter', price: 149, quantity: '500 Likes',
    features: ['Real active users', 'Delivery in 12–24 hrs'], popular: false },
  { id: 'like-growth', categoryId: 'likes', name: 'Growth', price: 399, quantity: '2,000 Likes',
    features: ['Real active users', 'Delivery in 12–24 hrs', 'Priority support'], popular: true },
  { id: 'like-pro', categoryId: 'likes', name: 'Pro', price: 799, quantity: '5,000 Likes',
    features: ['Real active users', 'Delivery in 24–48 hrs', 'Priority support', 'Dedicated manager'], popular: false },

  // ── Google Reviews ───────────────────────────────────────
  { id: 'gr-starter', categoryId: 'google-review', name: 'Starter', price: 499, quantity: '10 Reviews',
    features: ['Verified local accounts', '4–5 star ratings', 'Delivery in 3–5 days'], popular: false },
  { id: 'gr-growth', categoryId: 'google-review', name: 'Growth', price: 1999, quantity: '50 Reviews',
    features: ['Verified local accounts', '4–5 star ratings', 'Delivery in 7–10 days', 'Priority support'], popular: true },
  { id: 'gr-pro', categoryId: 'google-review', name: 'Pro', price: 3799, quantity: '100 Reviews',
    features: ['Verified local accounts', '4–5 star ratings', 'Delivery in 14 days', 'Priority support', 'Dedicated manager'], popular: false },

  // ── Website Ranking ──────────────────────────────────────
  { id: 'wr-starter', categoryId: 'website-ranking', name: 'Starter', price: 1499, quantity: '5 Keywords',
    features: ['On-page SEO audit', 'Monthly ranking report'], popular: false },
  { id: 'wr-growth', categoryId: 'website-ranking', name: 'Growth', price: 3999, quantity: '15 Keywords',
    features: ['On-page SEO audit', 'Monthly ranking report', 'Backlink building', 'Priority support'], popular: true },
  { id: 'wr-pro', categoryId: 'website-ranking', name: 'Pro', price: 7499, quantity: '40 Keywords',
    features: ['On-page SEO audit', 'Monthly ranking report', 'Backlink building', 'Priority support', 'Dedicated manager'], popular: false },

  // ── Website Visits ───────────────────────────────────────
  { id: 'wv-starter', categoryId: 'website-visits', name: 'Starter', price: 599, quantity: '2,000 Visits',
    features: ['Real human traffic', 'Delivery over 7 days'], popular: false },
  { id: 'wv-growth', categoryId: 'website-visits', name: 'Growth', price: 1499, quantity: '6,000 Visits',
    features: ['Real human traffic', 'Delivery over 10 days', 'Low bounce rate', 'Priority support'], popular: true },
  { id: 'wv-pro', categoryId: 'website-visits', name: 'Pro', price: 2999, quantity: '15,000 Visits',
    features: ['Real human traffic', 'Delivery over 14 days', 'Low bounce rate', 'Priority support', 'Dedicated manager'], popular: false },
]