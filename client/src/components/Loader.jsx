import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'medium', 
  text = 'Loading...', 
  showText = true,
  variant = 'spinner' 
}) => {
  return (
    <div className={`loader-container ${size}`} role="status" aria-live="polite">
      {variant === 'spinner' && (
        <div className="loader-spinner">
          <div className="spinner-ring">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className="loader-pulse">
          <div className="pulse-dot"></div>
          <div className="pulse-dot"></div>
          <div className="pulse-dot"></div>
        </div>
      )}
      
      {variant === 'medical' && (
        <div className="loader-medical">
          <div className="medical-cross">
            <div className="cross-horizontal"></div>
            <div className="cross-vertical"></div>
          </div>
        </div>
      )}
      
      {showText && (
        <div className="loader-text" aria-label={text}>
          {text}
        </div>
      )}
      
      {/* Screen reader only text */}
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default Loader;