import React from "react";
import { useNavigate } from 'react-router-dom'; // ← fixed: was Link, now useNavigate
import { motion } from 'framer-motion';
import img from "../../../assets/images/image4.jpg";
import "./CTA.css";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    x: 80,
    scale: 0.96,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function CTA() {
  const navigate = useNavigate(); // ← this was missing entirely

  return (
    <section className="cta">
      <motion.div
        className="cta-bg"
        initial={{ scale: 1.15, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={img} alt="EarnHub CTA" />
      </motion.div>

      <motion.div
        className="cta-content"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span className="cta-badge" variants={item}>
          JOIN FREE — NO CREDIT CARD
        </motion.span>

        <motion.h2 className="cta-title" variants={item}>
          Start Earning Online
          <br />
          In Less Than 30 Seconds
        </motion.h2>

        <motion.p className="cta-description" variants={item}>
          Join thousands of members already earning
          through simple activities, surveys, games,
          and rewards. Completely free to start.
        </motion.p>

        <motion.form className="cta-form" variants={item}>
          <motion.button
            type="button"
            onClick={() => navigate('/auth?tab=register')}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up Free →
          </motion.button>
        </motion.form>

        <motion.p className="cta-note" variants={item}>
          No approval • No credit card • Instant setup
        </motion.p>
      </motion.div>
    </section>
  );
}

export default CTA;