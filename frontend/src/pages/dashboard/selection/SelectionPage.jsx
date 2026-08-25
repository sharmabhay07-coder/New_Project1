import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaBullhorn } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

import "./../../auth/Auth";
import "./SelectionPage.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const options = [
  {
    icon: <IoWalletOutline size={36} />,
    title: "Earn Money",
    description:
      "Complete tasks, watch videos, and earn rewards through the platform.",
    path: "/dashboard",
    cta: "Start Earning",
  },
  {
    icon: <FaBullhorn size={36} />,
    title: "Promote Business",
    description:
      "Increase views, subscribers, engagement, and grow your brand.",
    path: "/dashboard/plans",
    cta: "View Plans",
  },
];

const SelectionPage = () => {
  return (
    <div className="page-bg">
      <div className="page-grid" />

      <motion.div
        className="selection-page-container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="selection-header" variants={item}>
          <span className="section-tag">CHOOSE YOUR PATH</span>

          <h2 className="selection-title">
            How will you use the platform?
          </h2>

          <p className="selection-description">
            Select how you want to get started. You can always explore other
            features later from within the platform.
          </p>
        </motion.div>

        <div className="selection-grid">
          {options.map((option) => (
            <motion.div
              key={option.title}
              variants={item}
              className="selection-card-wrapper"
              whileHover={{
                scale: 1.015,
                transition: { duration: 0.2 },
              }}
            >
              <Link
                to={option.path}
                className="selection-card-link"
                aria-label={option.title}
              >
                <div className="selection-card">
                  <div>
                    <div className="selection-card-icon">
                      {option.icon}
                    </div>

                    <h3>{option.title}</h3>

                    <p>{option.description}</p>
                  </div>

                  <div className="selection-card-cta">
                    <span>{option.cta}</span>
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SelectionPage;