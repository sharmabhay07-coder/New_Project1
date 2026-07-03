import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import './Topbar.css';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const avatarLetter = user?.name?.[0]?.toUpperCase() || 'U';

  // Indian rupee formatting — 2485 -> "2,485"
  const formatINR = (num) => new Intl.NumberFormat('en-IN').format(num ?? 0);

  return (
    <nav className={`dash-nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="/dashboard" className="dash-nav-logo">
        <div className="dash-nav-logo-icon">⚡</div>
        <span>Earn<strong>Hub</strong></span>
      </a>

      <div className="dash-nav-search">
        <Search size={15} className="dash-nav-search-icon" />
        <input placeholder="Search tasks..." />
      </div>

      <div className="dash-nav-links">
        <NavLink to="/dashboard" end className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/videos" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
          Videos
        </NavLink>
        <NavLink to="/dashboard/wallet" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
          Wallet
        </NavLink>
        <NavLink to="/dashboard/referrals" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
          Referrals
        </NavLink>
      </div>

      <div className="dash-nav-right">
        <div className="dash-nav-balance">
          <span className="dash-nav-balance-dot" />
          ₹{formatINR(user?.balance)}
        </div>

        <button className="dash-nav-bell">
          <Bell size={18} />
          <span className="dash-nav-bell-dot" />
        </button>

        <div className="dash-nav-user" ref={dropdownRef} onClick={() => setDropdownOpen(v => !v)}>
          <div className="dash-nav-avatar">{avatarLetter}</div>
          <span className="dash-nav-username">{user?.name || 'User'}</span>
          <ChevronDown size={14} className={`dash-nav-chevron ${dropdownOpen ? 'open' : ''}`} />

          {dropdownOpen && (
            <div className="dash-nav-dropdown">
              <div className="dash-nav-dropdown-user">
                <div className="dash-nav-dropdown-avatar">{avatarLetter}</div>
                <div>
                  <div className="dash-nav-dropdown-name">{user?.name}</div>
                  <div className="dash-nav-dropdown-email">{user?.email}</div>
                </div>
              </div>
              <div className="dash-nav-dropdown-divider" />
              <a href="/dashboard/settings" className="dash-nav-dropdown-item">
                <User size={14} /> Profile
              </a>
              <a href="/dashboard/settings" className="dash-nav-dropdown-item">
                <Settings size={14} /> Settings
              </a>
              <div className="dash-nav-dropdown-divider" />
              <button className="dash-nav-dropdown-item logout" onClick={handleLogout}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}