import { useState } from 'react';
import './PlatformPromo.css';

const TABS = [
  {
    id: 'watch',
    label: 'Watch',
    badge: 'DISCOVER',
    heading: 'Easily go from browsing to earning, fast',
    desc: 'Discover videos from top creators across YouTube, Instagram, TikTok and more — curated daily so there\'s always something fresh to earn from.',
    features: [
      { title: 'AI-curated video feed', sub: 'Personalized picks based on your activity and preferences' },
      { title: 'Multi-platform support', sub: 'Watch across YouTube, Instagram, TikTok and Facebook' },
      { title: 'Real-time task tracking', sub: 'See your progress and earnings update instantly' },
    ],
    stats: [{ label: 'Videos live', value: '2,400+' }, { label: 'Avg. reward', value: '$0.35' }],
    btnLabel: 'Browse Videos →',
  },
  {
    id: 'earn',
    label: 'Earn',
    badge: 'EARN',
    heading: 'Complete tasks and earn real money daily',
    desc: 'Simple tasks like watching, liking, sharing and following — each one pays you instantly into your EarnHub wallet.',
    features: [
      { title: 'Instant wallet credit', sub: 'Your earnings show up in real time' },
      { title: 'Multiple task types', sub: 'Videos, surveys, app installs and more' },
      { title: 'Daily bonus challenges', sub: 'Extra rewards for consistent earners' },
    ],
    stats: [{ label: 'Avg daily earn', value: '$12.40' }, { label: 'Tasks today', value: '48' }],
    btnLabel: 'Start Earning →',
  },
  {
    id: 'share',
    label: 'Share',
    badge: 'SHARE',
    heading: 'Share your referral link and earn passive income',
    desc: 'Invite friends to EarnHub and earn 20% commission on every task they complete — forever.',
    features: [
      { title: 'Lifetime commissions', sub: 'Earn on every task your referrals complete' },
      { title: 'One-click sharing', sub: 'Share on WhatsApp, Telegram, Twitter instantly' },
      { title: 'Live referral tracking', sub: 'See who joined and how much you earned' },
    ],
    stats: [{ label: 'Commission rate', value: '20%' }, { label: 'Avg ref earn', value: '$68' }],
    btnLabel: 'Share Now →',
  },
  {
    id: 'grow',
    label: 'Grow',
    badge: 'GROW',
    heading: 'Upgrade your plan and earn even more',
    desc: 'Pro and Premium members get access to higher-paying tasks, faster withdrawals and priority support.',
    features: [
      { title: 'Higher paying tasks', sub: 'Pro members get 2x earning potential' },
      { title: 'Fast withdrawals', sub: 'Same-day payouts for Pro and Premium' },
      { title: 'Priority support', sub: '24/7 dedicated support channel' },
    ],
    stats: [{ label: 'Pro boost', value: '2x' }, { label: 'Members', value: '12k+' }],
    btnLabel: 'Upgrade Plan →',
  },
];

export default function PlatformPromo() {
  const [activeTab, setActiveTab] = useState('watch');
  const tab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="pp-wrap">
      <div className="pp-header">
        <h2 className="pp-title">
          One platform. <span className="pp-title-accent">Every task.</span>
        </h2>
        <p className="pp-sub">
          Whether you're just starting out or scaling your daily earnings, EarnHub grows with you.
        </p>
        <div className="pp-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`pp-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pp-body">
        <div className="pp-left">
          <div className="pp-badge">{tab.badge}</div>
          <h3 className="pp-heading">{tab.heading}</h3>
          <p className="pp-desc">{tab.desc}</p>
          <div className="pp-features">
            {tab.features.map((f, i) => (
              <div key={i} className="pp-feature">
                <div className="pp-feature-arrow">›</div>
                <div>
                  <div className="pp-feature-title">{f.title}</div>
                  <div className="pp-feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-right">
          <div className="pp-preview-card">
            <div className="pp-preview-head">
              <div className="pp-preview-logo">⚡</div>
              <span>EarnHub — {tab.label}</span>
              <div className="pp-preview-dots">
                <span /><span /><span />
              </div>
            </div>
            <div className="pp-preview-stats">
              {tab.stats.map((s, i) => (
                <div key={i} className="pp-preview-stat">
                  <div className="pp-preview-stat-val">{s.value}</div>
                  <div className="pp-preview-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="pp-preview-rows">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="pp-preview-row">
                  <div className="pp-preview-avatar" />
                  <div className="pp-preview-line">
                    <div className="pp-preview-line-a" />
                    <div className="pp-preview-line-b" />
                  </div>
                  <div className="pp-preview-earn">
                    +${(0.30 - i * 0.05).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <button className="pp-preview-btn">{tab.btnLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}