// Updated: 2025-12-19 12:04:42 - fix: enhance socket dashboard
// Updated: 2025-12-19 12:04:33 - refactor(patient): enhance error handling in patient
// Updated: 2025-12-19 12:04:26 - feat(database): optimize database database schema
// Updated: 2025-12-19 12:04:06 - test(database): improve authentication
// Updated: 2025-12-19 12:04:03 - style(api): update database schema (fixes #20)
// Updated: 2025-12-19 12:03:31 - feat: enhance database database schema
import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header-nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Keyboard navigation for hamburger menu
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  };

  return (
    <header className="header" role="banner">
      <nav className="header-nav" role="navigation" aria-label="Main navigation">
        <div className="header-container">
          {/* Logo/Brand */}
          <div className="header-logo">
            <button
              onClick={handleLogoClick}
              className="logo-button"
              aria-label="Go to home page"
            >
              <span className="logo-icon">ðŸ©º</span>
              <span className="logo-text">EmergenX</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="header-menu-desktop">
            <ul className="nav-links" role="menubar">
              <li role="none">
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  role="menuitem"
                  aria-label="Home"
                >
                  Home
                </NavLink>
              </li>

              {user ? (
                <>
                  <li role="none">
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                      role="menuitem"
                      aria-label="Dashboard"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li role="none">
                    <NavLink
                      to="/triage"
                      className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                      role="menuitem"
                      aria-label="Emergency Assessment"
                    >
                      Assessment
                    </NavLink>
                  </li>
                  <li role="none">
                    <button
                      onClick={handleLogout}
                      className="nav-link logout-btn"
                      role="menuitem"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li role="none">
                    <NavLink
                      to="/login"
                      className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                      role="menuitem"
                      aria-label="Login"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li role="none">
                    <NavLink
                      to="/register"
                      className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                      role="menuitem"
                      aria-label="Register"
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Theme Toggle */}
            <div className="theme-toggle-container">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="header-mobile-controls">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              onKeyDown={handleKeyDown}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`header-menu-mobile ${isMenuOpen ? 'active' : ''}`}
          role="menu"
          aria-hidden={!isMenuOpen}
        >
          <ul className="mobile-nav-links">
            <li role="none">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                }
                onClick={handleNavClick}
                role="menuitem"
                aria-label="Home"
              >
                Home
              </NavLink>
            </li>

            {user ? (
              <>
                <li role="none">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => 
                      isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                    }
                    onClick={handleNavClick}
                    role="menuitem"
                    aria-label="Dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/triage"
                    className={({ isActive }) => 
                      isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                    }
                    onClick={handleNavClick}
                    role="menuitem"
                    aria-label="Emergency Assessment"
                  >
                    Assessment
                  </NavLink>
                </li>
                <li role="none">
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-link logout-btn"
                    role="menuitem"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li role="none">
                  <NavLink
                    to="/login"
                    className={({ isActive }) => 
                      isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                    }
                    onClick={handleNavClick}
                    role="menuitem"
                    aria-label="Login"
                  >
                    Login
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/register"
                    className={({ isActive }) => 
                      isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
                    }
                    onClick={handleNavClick}
                    role="menuitem"
                    aria-label="Register"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;





