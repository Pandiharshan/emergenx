import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Auto-redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000); // 3 second delay for UX

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="notfound-wrapper">
      
      <main className="notfound-container">
        <div className="notfound-content">
          
          {/* Animated 404 Number */}
          <div className="error-number">
            <span className="digit-4 digit-bounce">4</span>
            <div className="digit-0-container">
              <div className="stethoscope-circle">
                <div className="stethoscope-inner">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring delay-1"></div>
                  <div className="pulse-ring delay-2"></div>
                </div>
              </div>
            </div>
            <span className="digit-4 digit-bounce delay">4</span>
          </div>

          {/* Medical Illustration */}
          <div className="medical-illustration">
            <div className="medical-cross">
              <div className="cross-horizontal"></div>
              <div className="cross-vertical"></div>
            </div>
            <div className="heartbeat-line">
              <svg viewBox="0 0 200 50" className="heartbeat-svg">
                <path 
                  d="M10,25 L30,25 L35,10 L40,40 L45,15 L50,35 L55,25 L190,25" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="heartbeat-path"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="error-message">
            <h1 className="error-title">Page Not Found</h1>
            <p className="error-description">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            {user && (
              <div className="redirect-notice">
                <div className="redirect-icon">🏥</div>
                <p>Since you're logged in, we'll redirect you to your dashboard in a moment...</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {user ? (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={handleGoToDashboard}
                  aria-label="Go to dashboard"
                >
                  <span className="btn-icon">📊</span>
                  Go to Dashboard
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleBackToHome}
                  aria-label="Back to home page"
                >
                  <span className="btn-icon">🏠</span>
                  Back to Home
                </button>
              </>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={handleBackToHome}
                aria-label="Back to home page"
              >
                <span className="btn-icon">🏠</span>
                Back to Home
              </button>
            )}
          </div>

          {/* Floating Medical Icons */}
          <div className="floating-icons">
            <div className="floating-icon icon-1">⚕️</div>
            <div className="floating-icon icon-2">🩺</div>
            <div className="floating-icon icon-3">💊</div>
            <div className="floating-icon icon-4">🏥</div>
            <div className="floating-icon icon-5">❤️</div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default NotFound;