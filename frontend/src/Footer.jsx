import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>EarnHub</h2>

        <ul className="footer-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <p>© 2026 EarnHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;