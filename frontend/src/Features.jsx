import React, { useRef, useState, useEffect } from "react";
import "./Features.css";

const features = [
  {
    icon: "💰",
    title: "Generous Bonuses",
    description:
      "Top earners get daily and weekly performance bonuses stacked on top of their task rewards.",
  },
  {
    icon: "💳",
    title: "6 Payment Methods",
    description:
      "PayPal, crypto, gift cards and more — a payout option that always works for you.",
    tags: ["PayPal", "Crypto", "Visa", "Gift Cards"],
  },
  {
    icon: "🌐",
    title: "Referral Network",
    description:
      "Our referral network grows with every member you bring in — earning passive commission forever.",
  },
  {
    icon: "🏆",
    title: "Performance Rewards",
    description:
      "Earn time-based rewards for consistency. The more you show up, the more you earn.",
  },
  {
    icon: "⚡",
    title: "Instant Withdrawals",
    description:
      "Your balance hits your wallet the same day — instant payouts every single day without delays.",
  },
  {
    icon: "🛡️",
    title: "Sound Too Good?",
    description:
      "Sign up and let us prove you wrong. 20,000+ five-star reviews back every single claim.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);   // ENTER → render
        } else {
          setVisible(false);  // EXIT → remove (rerender trigger)
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`features ${visible ? "show" : ""}`}
    >
      <div className="features-header">
        <span className="section-tag">WHY EARNHUB</span>

        <h2>Everything you need to earn more</h2>

        <p>
          No experience needed. No approval required. Sign up in seconds and earn your first dollar today.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>

            {feature.tags && (
              <div className="feature-tags">
                {feature.tags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;