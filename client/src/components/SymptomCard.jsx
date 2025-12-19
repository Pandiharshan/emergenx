import React from 'react';
import './SymptomCard.css';

const SymptomCard = ({ symptom, onClick }) => {
  const { name, severity, selected, description } = symptom;

  // Determine severity styling
  const getSeverityConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return { color: '#28a745', icon: '⚠️', label: 'Low' };
      case 'medium':
        return { color: '#ffc107', icon: '❗', label: 'Medium' };
      case 'high':
        return { color: '#dc3545', icon: '🚨', label: 'High' };
      default:
        return { color: '#6c757d', icon: '●', label: 'Unknown' };
    }
  };

  const severityConfig = getSeverityConfig(severity);

  const handleClick = () => {
    if (onClick) {
      onClick(symptom);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`symptom-card ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${name} symptom, ${severityConfig.label} severity${selected ? ', selected' : ''}`}
    >
      <div className="symptom-card-header">
        <div className="symptom-info">
          <h3 className="symptom-name">{name}</h3>
          <div 
            className="severity-indicator"
            style={{ '--severity-color': severityConfig.color }}
          >
            <span className="severity-icon">{severityConfig.icon}</span>
            <span className="severity-label">{severityConfig.label}</span>
          </div>
        </div>
        <div className="selection-indicator">
          {selected && (
            <div className="check-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {description && (
        <div className="symptom-description">
          <p>{description}</p>
        </div>
      )}
      
      <div className="symptom-card-footer">
        <span className="interaction-hint">
          {selected ? 'Selected' : 'Click to select'}
        </span>
      </div>
    </div>
  );
};

export default SymptomCard;