import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Briefcase, Kanban, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

/**
 * Navbar Component (Shared)
 * Sticky header with conditional auth navigation, responsive drawer, and shared icon-text spacing.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${anchorId}`);
      return;
    }
    const element = document.querySelector(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" aria-label="CareerOS Home">
          <div className="logo-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15L9 10L13 14L20 7" />
              <path d="M14 7H20V13" />
            </svg>
          </div>
          <span className="brand-wordmark">
            Career<span className="logo-accent">OS</span>
          </span>
        </Link>

        {/* Desktop Navigation Links - Conditional based on Auth State */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>

          {isAuthenticated ? (
            /* Logged In Navigation */
            <>
              <Link to="/dashboard" className={`nav-link nav-icon-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/jobs" className={`nav-link nav-icon-link ${location.pathname === '/jobs' ? 'active' : ''}`}>
                <Briefcase size={16} />
                <span>Jobs</span>
              </Link>
              <Link to="/tracker" className={`nav-link nav-icon-link ${location.pathname === '/tracker' ? 'active' : ''}`}>
                <Kanban size={16} />
                <span>Tracker</span>
              </Link>
              <Link to="/interview-prep" className={`nav-link nav-icon-link ${location.pathname === '/interview-prep' ? 'active' : ''}`}>
                <BookOpen size={16} />
                <span>Prep Portal</span>
              </Link>
            </>
          ) : (
            /* Logged Out Visitor Navigation */
            <>
              <button onClick={() => handleNavClick('#problem')} className="nav-link nav-btn-link">
                Why Us
              </button>
              <button onClick={() => handleNavClick('#features')} className="nav-link nav-btn-link">
                Features
              </button>
              <button onClick={() => handleNavClick('#how-it-works')} className="nav-link nav-btn-link">
                How It Works
              </button>
              <Link to="/interview-prep" className={`nav-link nav-icon-link ${location.pathname === '/interview-prep' ? 'active' : ''}`}>
                <BookOpen size={16} />
                <span>Prep Portal</span>
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="navbar-auth-actions">
          {isAuthenticated ? (
            <div className="auth-user-dropdown">
              <Link to="/profile" className="user-badge-link" title="Click to view & edit profile">
                <div className="user-badge">
                  <img src={user?.avatarUrl} alt={user?.name} className="user-avatar" />
                  <span className="user-name">{user?.name}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn-icon" aria-label="Log out" title="Log out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="btn btn-outline">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary nav-icon-link">
                <span>Get Started</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link nav-icon-link">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link nav-icon-link">
                  <Briefcase size={18} />
                  <span>Jobs</span>
                </Link>
                <Link to="/tracker" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link nav-icon-link">
                  <Kanban size={18} />
                  <span>Tracker</span>
                </Link>
                <Link to="/interview-prep" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link nav-icon-link">
                  <BookOpen size={18} />
                  <span>Prep Portal</span>
                </Link>

                <div className="mobile-auth-divider" />

                <div className="mobile-user-section">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-user-info user-badge-link">
                    <img src={user?.avatarUrl} alt={user?.name} className="user-avatar-lg" />
                    <div>
                      <p className="mobile-user-name">{user?.name}</p>
                      <p className="mobile-user-email">{user?.email}</p>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline w-full nav-icon-link justify-center mt-2">
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('#problem')} className="mobile-nav-link text-left">
                  Why Us
                </button>
                <button onClick={() => handleNavClick('#features')} className="mobile-nav-link text-left">
                  Features
                </button>
                <button onClick={() => handleNavClick('#how-it-works')} className="mobile-nav-link text-left">
                  How It Works
                </button>
                <Link to="/interview-prep" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link nav-icon-link">
                  <BookOpen size={18} />
                  <span>Prep Portal</span>
                </Link>

                <div className="mobile-auth-divider" />

                <div className="mobile-auth-buttons">
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline w-full">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full nav-icon-link justify-center">
                    <span>Get Started</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
