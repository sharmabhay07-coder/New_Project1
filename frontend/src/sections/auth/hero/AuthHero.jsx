import { useEffect, useState } from 'react';
import './AuthHero.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ClipboardList, Smartphone, Clapperboard, Link2, Wallet } from 'lucide-react';

import slideTasks from     '../../../assets/images/image1.jpg';
import slidePayouts from   '../../../assets/images/image2.jpg';
import slideReferrals from '../../../assets/images/image3.jpg';
import slideReviews from   '../../../assets/images/image4.jpg';

const SLIDES = [
    {
        cls: 's1',
        image: slideTasks,
        title: <>Turn Time Into <em>Real Money</em></>,
        desc: 'Complete simple tasks from anywhere — surveys, games, app installs — and get paid daily.',
    },
    {
        cls: 's2',
        image: slidePayouts,
        title: <><em>Daily Payouts,</em> No Waiting</>,
        desc: '6 payment methods including PayPal and crypto. Your earnings hit your wallet same day.',
    },
    {
        cls: 's3',
        image: slideReferrals,
        title: <>Build Your <em>Referral Network</em></>,
        desc: 'Invite friends and earn passive commission on every task they complete. Forever.',
    },
    {
        cls: 's4',
        image: slideReviews,
        title: <><em>4.8★ Trustpilot</em> Rated</>,
        desc: 'Over 20,000 verified reviews. Paying consistently since 2015. Trusted by millions.',
    },
];

const ICON_CARDS = [
    { Icon: Gamepad2, label: 'GAMES', value: '+$3.50' },
    { Icon: ClipboardList, label: 'SURVEYS', value: '+$2.20' },
    { Icon: Smartphone, label: 'APPS', value: '+$4.00' },
    { Icon: Clapperboard, label: 'VIDEOS', value: '+$1.80' },
    { Icon: Link2, label: 'REFERRALS', value: '+$5.00' },
    { Icon: Wallet, label: 'BALANCE', value: '$148.60' },
];

export default function AuthHero() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((i) => (i + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="left">
            <div className="left-logo">
                Earn<span>Hub</span>
            </div>

            {SLIDES.map((s, i) => (
                <div
                    key={s.cls}
                    className={`slide ${s.cls} ${i === active ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${s.image})` }}
                />
            ))}

            <div className="slide-overlay" />

            <div className="scene-icons">
                <div className="icon-grid">
                    {ICON_CARDS.map(({ Icon, label, value }, idx) => (
                        <div className="ic-card" key={label}>
                            <Icon size={20} className="ic-emoji" style={{ display: 'block', margin: '0 auto 5px' }} />
                            <span className="ic-label">{label}</span>
                            <div className="ic-value">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    className="slide-text active"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45 }}
                >
                    <div className="slide-title">{SLIDES[active].title}</div>
                    <div className="slide-desc">{SLIDES[active].desc}</div>
                </motion.div>
            </AnimatePresence>

            <div className="left-dots">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        className={`ldot ${i === active ? 'active' : ''}`}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>
        </div>
    );
}