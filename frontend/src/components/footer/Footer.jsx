import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <h2 className="footer-logo">
          Earn<span>Hub</span>
        </h2>

        <p className="footer-text">
          Earn rewards online by completing simple tasks,
          referring friends, and getting paid instantly.
        </p>

        <ul className="footer-links">
          <li>
            <a href="#">Home</a>
          </li>

          <li>
            <a href="#">How It Works</a>
          </li>

          <li>
            <a href="#">Tasks</a>
          </li>

          <li>
            <a href="#">Contact</a>
          </li>
        </ul>

        <div className="footer-divider"></div>

        <p className="footer-copy">
          © 2026 EarnHub. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;