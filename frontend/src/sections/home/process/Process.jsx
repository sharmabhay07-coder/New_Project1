import React from "react";
import { motion } from "framer-motion";
import "./Process.css";

const steps = [
  {
    number: "1",
    title: "Create Account",
    description:
      "Sign up in seconds using email or social login and get started instantly.",
  },
  {
    number: "2",
    title: "Complete Tasks",
    description:
      "Choose tasks from dashboard and complete them easily with simple steps.",
  },
  {
    number: "3",
    title: "Get Paid",
    description:
      "Withdraw your earnings securely using multiple payment methods.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 80,
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

function Process() {
  return (
    <section className="process">
      <div className="container">
        <motion.span
          className="section-tag"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.span>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Simple 3 Step Process
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Follow these steps to complete your journey quickly and efficiently
          with a smooth workflow experience.
        </motion.p>

        <motion.div
          className="steps"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step) => (
            <motion.article
              key={step.number}
              className="step"
              variants={itemVariants}
              whileHover={{
                y: -12,
              }}
            >
              <motion.div
                className="step-number"
                whileHover={{
                  scale: 1.15,
                  rotate: 8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
              >
                {step.number}
              </motion.div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Process;