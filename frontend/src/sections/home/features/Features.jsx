import React from "react";
import "./Features.css";
import { motion } from "motion/react";

const features = [
  {
    icon: "💰",
    title: "Generous Bonuses",
    description:
      "Top performers unlock daily and weekly bonuses on top of their regular task earnings.",
  },
  {
    icon: "💳",
    title: "Flexible Payouts",
    description:
      "Withdraw through PayPal, crypto, gift cards, bank transfer, and more.",
    tags: ["PayPal", "Crypto", "Gift Cards"],
  },
  {
    icon: "🌐",
    title: "Referral Earnings",
    description:
      "Invite your friends and keep earning passive commissions as they stay active.",
  },
  {
    icon: "🏆",
    title: "Performance Rewards",
    description:
      "Stay consistent and unlock higher rewards, exclusive bonuses, and achievements.",
  },
  {
    icon: "⚡",
    title: "Instant Withdrawals",
    description:
      "Get your money quickly with fast and reliable withdrawal processing.",
  },
  {
    icon: "🛡️",
    title: "Trusted Platform",
    description:
      "Thousands of users trust EarnHub for its transparency, secure payouts, and reliability.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

function Features() {
  return (
    <section className="features">
      <div className="features-container">
        {/* Header Animation */}
        <motion.div
          className="features-header"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span
            className="section-tag"
            variants={item}
          >
            WHY EARNHUB
          </motion.span>

          <motion.h2 variants={item}>
            Everything you need
            <br />
            to earn more
          </motion.h2>

          <motion.p variants={item}>
            No experience required. Sign up in
            minutes, complete simple activities,
            and start earning real rewards from
            anywhere.
          </motion.p>
        </motion.div>

        {/* Cards Animation */}
        <motion.div
          className="features-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className="feature-card"
              variants={item}
              whileHover={{
                y: -8,
                transition: { duration: 0.25 },
              }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              {feature.tags && (
                <div className="feature-tags">
                  {feature.tags.map((tag) => (
                    <span key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;