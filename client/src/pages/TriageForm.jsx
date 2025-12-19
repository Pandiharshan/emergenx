import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TriageContext } from '../context/TriageContext';
import SymptomCard from '../components/SymptomCard';
import Loader from '../components/Loader';
import * as triageService from '../services/triageService';

// Static symptoms array - can be moved to a separate file or fetched from API
const SYMPTOMS = [
  {
    id: 1,
    name: 'Chest Pain',
    description: 'Pain or discomfort in the chest area',
    severity: 'high',
    category: 'cardiac'
  },
  {
    id: 2,
    name: 'Shortness of Breath',
    description: 'Difficulty breathing or feeling out of breath',
    severity: 'high',
    category: 'respiratory'
  },
  {
    id: 3,
    name: 'Fever',
    description: 'Body temperature above normal (100.4°F/38°C)',
    severity: 'medium',
    category: 'general'
  },
  {
    id: 4,
    name: 'Headache',
    description: 'Pain in the head or neck area',
    severity: 'low',
    category: 'neurological'
  },
  {
    id: 5,
    name: 'Nausea/Vomiting',
    description: 'Feeling sick to stomach or vomiting',
    severity: 'medium',
    category: 'gastrointestinal'
  },
  {
    id: 6,
    name: 'Dizziness',
    description: 'Feeling lightheaded or unsteady',
    severity: 'medium',
    category: 'neurological'
  },
  {
    id: 7,
    name: 'Abdominal Pain',
    description: 'Pain in the stomach or abdominal area',
    severity: 'medium',
    category: 'gastrointestinal'
  },
  {
    id: 8,
    name: 'Fatigue',
    description: 'Extreme tiredness or exhaustion',
    severity: 'low',
    category: 'general'
  },
  {
    id: 9,
    name: 'Cough',
    description: 'Persistent coughing',
    severity: 'low',
    category: 'respiratory'
  },
  {
    id: 10,
    name: 'Skin Rash',
    description: 'Unusual skin changes or irritation',
    severity: 'low',
    category: 'dermatological'
  },
  {
    id: 11,
    name: 'Joint Pain',
    description: 'Pain in joints or muscles',
    severity: 'low',
    category: 'musculoskeletal'
  },
  {
    id: 12,
    name: 'Difficulty Swallowing',
    description: 'Problems swallowing food or liquids',
    severity: 'medium',
    category: 'gastrointestinal'
  }
];

const TriageForm = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { selectedSymptoms, setSelectedSymptoms } = useContext(TriageContext);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/triage/results/${response._id}`, { state: { result: response } });
    }
  }, [user, authLoading, navigate]);

  // Handle symptom selection/deselection
  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      const isSelected = prev.some(s => s.id === symptom.id);
      
      if (isSelected) {
        // Remove symptom
        return prev.filter(s => s.id !== symptom.id);
      } else {
        // Add symptom
        return [...prev, symptom];
      }
    });
  };

  // Clear all selected symptoms
  const handleClearAll = () => {
    setSelectedSymptoms([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmitProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSubmitProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Submit triage data
      console.log('Selected symptoms:', selectedSymptoms);
      const response = await triageService.submitTriage(selectedSymptoms);
      console.log('Triage submission response:', response);
      
      clearInterval(progressInterval);
      setSubmitProgress(100);
      
      // Small delay to show completion
      setTimeout(() => {
        if (response && response._id) {
          navigate(`/triage/results/${response._id}`, { state: { result: response } });
        } else {
          // Handle error: no ID returned
          setError('Could not retrieve assessment result. Please try again.');
        }
      }, 500);

    } catch (err) {
      setIsSubmitting(false);
      setSubmitProgress(0);
      setError(err.message || 'An error occurred while submitting your assessment. Please try again.');
    }
  };

  // Retry submission
  const handleRetry = () => {
    setError(null);
    handleSubmit({ preventDefault: () => {} });
  };

  // Show loader while checking authentication
  if (authLoading) {
    return (
      <div className="triage-form-container">
        <div className="auth-loading">
          <Loader />
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="triage-form-container">
      <header className="triage-header">
        <h1>Health Assessment</h1>
        <p className="triage-subtitle">
          Select all symptoms you are currently experiencing. This will help us provide you with appropriate care recommendations.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="triage-form" noValidate>
        {/* Symptoms Section */}
        <section className="symptoms-section" aria-labelledby="symptoms-heading">
          <h2 id="symptoms-heading">Select Your Symptoms</h2>
          <div className="symptoms-grid" role="group" aria-labelledby="symptoms-heading">
            {SYMPTOMS.map(symptom => (
              <SymptomCard
                key={symptom.id}
                symptom={{
                  ...symptom,
                  selected: selectedSymptoms.some(s => s.id === symptom.id)
                }}
                onClick={handleSymptomToggle}
              />
            ))}
          </div>
        </section>

        {/* Selected Symptoms Summary */}
        {selectedSymptoms.length > 0 && (
          <section className="summary-section" aria-labelledby="summary-heading">
            <div className="summary-header">
              <h3 id="summary-heading">Selected Symptoms ({selectedSymptoms.length})</h3>
              <button
                type="button"
                onClick={handleClearAll}
                className="clear-all-btn"
                aria-label="Clear all selected symptoms"
              >
                Clear All
              </button>
            </div>
            <div className="selected-symptoms-list" role="list">
              {selectedSymptoms.map(symptom => (
                <div key={symptom.id} className="selected-symptom-item" role="listitem">
                  <span className="symptom-name">{symptom.name}</span>
                  <span className={`severity-badge severity-${symptom.severity}`}>
                    {symptom.severity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className="remove-symptom-btn"
                    aria-label={`Remove ${symptom.name} from selection`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-section" role="alert" aria-live="polite">
            <div className="error-message">
              <span className="error-icon">⚠</span>
              <span className="error-text">{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="retry-btn"
              disabled={isSubmitting}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {isSubmitting && (
          <div className="progress-section" aria-live="polite">
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${submitProgress}%` }}
                role="progressbar"
                aria-valuenow={submitProgress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Assessment submission progress"
              />
            </div>
            <p className="progress-text">Submitting your assessment...</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="submit-section">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || selectedSymptoms.length === 0}
            aria-describedby={selectedSymptoms.length === 0 ? "submit-help" : undefined}
          >
            {isSubmitting ? (
              <>
                <Loader size="small" />
                <span>Submitting Assessment...</span>
              </>
            ) : (
              <>
                <span>Submit Assessment</span>
                <span className="submit-icon">→</span>
              </>
            )}
          </button>
          
          {selectedSymptoms.length === 0 && (
            <p id="submit-help" className="submit-help-text">
              Please select at least one symptom to continue
            </p>
          )}
        </div>
      </form>

      {/* Emergency Notice */}
      <div className="emergency-notice" role="complementary">
        <div className="emergency-content">
          <span className="emergency-icon">🚨</span>
          <div className="emergency-text">
            <strong>Emergency?</strong> If you are experiencing a medical emergency, 
            call 911 or go to your nearest emergency room immediately.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriageForm;