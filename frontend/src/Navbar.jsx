import React, { useState } from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      
        <div className="logo">
        <h1 className="logo-text">Earn <span >Hub</span></h1>
      </div>
      

      <ul className="nav-links">
        <li><a href="#">How it Works</a></li>
        <li><a href="#">Task Types</a></li>
        <li><a href="#">Payouts</a></li>
        <li><a href="#">Reviews</a></li>
      </ul>

      <div className="nav-right">

        

        <button className="login-btn">
          Login
        </button>

        <button className="signup-btn">
          Sign Up Free
        </button>

      </div>
    </nav>
  );
}

export default Navbar;