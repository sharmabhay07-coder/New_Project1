import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";
import { navLinks } from "../../data/navLinks";

const drawerLinkVariants = {
  hidden: { opacity: 0, x: 30 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="navbar-row">

          {/* LOGO */}
          <div className="logo" onClick={closeMenu}>
            <h1 className="logo-text">
              Earn <span>Hub</span>
            </h1>
          </div>

          {/* DESKTOP LINKS */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li
                key={link.label}
                onMouseEnter={() =>
                  setOpenMenu(link.megaMenu ? link.label : null)
                }
              >
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            <Link to="/auth" className="login-btn">
              Login
            </Link>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link to="/auth?tab=register" className="signup-btn">
                Sign Up
              </Link>
            </motion.div>

            {/* HAMBURGER */}
            <motion.div
              className={`hamburger ${mobileOpen ? "active" : ""}`}
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fi fi-br-bars-sort" style={{ color: "#10b981", fontSize: "28px" }}></i>
            </motion.div>
          </div>
        </div>

        {/* MEGA MENU */}
        {navLinks.map((link) => {
          if (!link.megaMenu) return null;

          const isOpen = openMenu === link.label;

          return (
            <div
              key={link.label}
              className={`mega-menu ${isOpen ? "open" : ""}`}
            >
              <div className="mega-menu-inner">
                {link.megaMenu.columns.map((col) => (
                  <div className="mega-col" key={col.heading}>
                    <div className="mega-col-heading">
                      {col.heading}
                    </div>

                    {col.links.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="overlay show"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>

        {/* HEADER */}
        <div className="drawer-top">
          <h2 className="drawer-logo">
            Earn <span>Hub</span>
          </h2>

          <motion.button
            className="close-btn"
            onClick={closeMenu}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            X
          </motion.button>
        </div>

        {/* LINKS */}
        <div className="mobile-links">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.label}
              custom={i}
              variants={drawerLinkVariants}
              initial="hidden"
              animate={mobileOpen ? "show" : "hidden"}
            >
              <Link to={link.path} onClick={closeMenu}>
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* AUTH */}
        <motion.div
          className="mobile-auth"
          custom={navLinks.length}
          variants={drawerLinkVariants}
          initial="hidden"
          animate={mobileOpen ? "show" : "hidden"}
        >
          <Link to="/auth" onClick={closeMenu}>
            Login
          </Link>

          <Link to="/auth?tab=register" onClick={closeMenu}>
            Sign Up Free
          </Link>
        </motion.div>

      </div>
    </>
  );
}

export default Navbar;