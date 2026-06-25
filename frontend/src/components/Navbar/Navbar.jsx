import React, {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { navLinks } from "../../data/navLinks";

function Navbar() {
  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""
        }`}
    >
<div className="logo" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>
  <h1 className="logo-text">
    Earn <span>Hub</span>
  </h1>
</div>

      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <Link to="/auth" className="login-btn">
          Login
        </Link>

        <Link to="/auth?tab=register" className="signup-btn">
          Sign Up Free
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;