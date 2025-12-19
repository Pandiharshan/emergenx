import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme, isToggling = false }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div className="theme-toggle-wrapper">
      <button
        className={`theme-toggle ${theme} ${isToggling ? 'toggling' : ''}`}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        aria-pressed={theme === 'dark'}
        role="switch"
        tabIndex={0}
      >
        {/* Background track */}
        <div className="toggle-track">
          {/* Animated background elements */}
          <div className="sky-gradient"></div>
          <div className="stars">
            <span className="star star-1"></span>
            <span className="star star-2"></span>
            <span className="star star-3"></span>
            <span className="star star-4"></span>
            <span className="star star-5"></span>
          </div>
          <div className="clouds">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
          </div>
        </div>

        {/* Sliding thumb with icons */}
        <div className="toggle-thumb">
          <div className="icon-container">
            <Sun className={`icon sun-icon ${theme === 'light' ? 'active' : ''}`} size={16} />
            <Moon className={`icon moon-icon ${theme === 'dark' ? 'active' : ''}`} size={16} />
          </div>
        </div>

        {/* Ripple effect */}
        <div className="ripple"></div>
      </button>

      <style jsx>{`
        .theme-toggle-wrapper {
          position: relative;
          display: inline-block;
        }

        .theme-toggle {
          position: relative;
          width: 64px;
          height: 32px;
          border: none;
          border-radius: 16px;
          background: transparent;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .theme-toggle:focus-visible {
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .theme-toggle:hover {
          transform: scale(1.05);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .theme-toggle.toggling {
          transform: scale(0.95);
        }

        .toggle-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
        }

        .sky-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%);
          transition: all 0.6s ease;
        }

        .theme-toggle.dark .sky-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .theme-toggle.dark .stars {
          opacity: 1;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite;
        }

        .star-1 { top: 6px; left: 10px; animation-delay: 0s; }
        .star-2 { top: 12px; left: 20px; animation-delay: 0.5s; }
        .star-3 { top: 8px; left: 35px; animation-delay: 1s; }
        .star-4 { top: 18px; left: 45px; animation-delay: 1.5s; }
        .star-5 { top: 4px; left: 50px; animation-delay: 2s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .clouds {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 1;
          transition: opacity 0.6s ease;
        }

        .theme-toggle.dark .clouds {
          opacity: 0;
        }

        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 10px;
          animation: float 3s ease-in-out infinite;
        }

        .cloud-1 {
          width: 12px;
          height: 4px;
          top: 8px;
          left: 8px;
          animation-delay: 0s;
        }

        .cloud-2 {
          width: 8px;
          height: 3px;
          top: 18px;
          left: 40px;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 28px;
          height: 28px;
          background: white;
          border-radius: 50%;
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle.dark .toggle-thumb {
          transform: translateX(32px);
          background: #1f2937;
        }

        .icon-container {
          position: relative;
          width: 16px;
          height: 16px;
        }

        .icon {
          position: absolute;
          top: 0;
          left: 0;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .sun-icon {
          color: #fbbf24;
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .moon-icon {
          color: #e5e7eb;
          opacity: 0;
          transform: rotate(180deg) scale(0);
        }

        .theme-toggle.dark .sun-icon {
          opacity: 0;
          transform: rotate(-180deg) scale(0);
        }

        .theme-toggle.dark .moon-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .theme-toggle:active .ripple {
          width: 60px;
          height: 60px;
          opacity: 1;
        }

        .theme-toggle.toggling .ripple {
          width: 40px;
          height: 40px;
          opacity: 0.6;
        }

        /* Health-focused accessibility improvements */
        .theme-toggle:focus-visible {
          box-shadow: 
            0 0 0 3px rgba(16, 185, 129, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .theme-toggle,
          .toggle-thumb,
          .sky-gradient,
          .stars,
          .clouds,
          .icon,
          .ripple {
            transition: none !important;
            animation: none !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .theme-toggle {
            border: 2px solid currentColor;
          }
          
          .toggle-thumb {
            box-shadow: 
              0 0 0 2px currentColor,
              0 2px 6px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;