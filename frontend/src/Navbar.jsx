import React from 'react'
import "./Navbar.css";

function Navbar() {
  return (
    <nav className='navbar'>
        <div className='navbar-logo'>
            <h1>Earn <span>Hub</span></h1>
        </div>
        <ul>
            <li>
                <a href="#">How it works</a>
            </li>
            <li>
                <a href="#">Task Types</a>
            </li>
            <li>
                <a href="#">Payouts</a>
            </li>
            <li>
                <a href="#">Reviews</a>
            </li>
        </ul>
        <div className='navbar-buttons'>
         <button>Login</button>
         <button>Signup</button>
        </div>
    </nav>
  )
}

export default Navbar