import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as triageService from '../services/triageService';
import Loader from '../components/Loader';

const TriageHistory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [triageHistory, setTriageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch triage history
  const fetchTriageHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await triageService.getTriageHistory();
      const history = response.data?.history || [];
      
      // Sort by date (most recent first)
      const sortedHistory = history.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setTriageHistory(sortedHistory);
    } catch (err) {
      setError(err.message || 'Failed to load triage history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch history on component mount (if user is authenticated)
  useEffect(() => {
    if (user && !authLoading) {
      fetchTriageHistory();
    }
  }, [user, authLoading]);

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchTriageHistory();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Get severity badge info
  const getSeverityBadge = (severity) => {
    const severityMap = {
      high: { icon: '🔴', color: 'red', label: 'High Priority' },
      medium: { icon: '🟡', color: 'yellow', label: 'Medium Priority' },
      low: { icon: '🟢', color: 'green', label: 'Low Priority' }
    };
    
    return severityMap[severity] || severityMap.low;
  };

  // Calculate overall severity from symptoms
  const calculateOverallSeverity = (symptoms) => {
    if (!symptoms || symptoms.length === 0) return 'low';
    
    const highCount = symptoms.filter(s => s.severity === 'high').length;
    const mediumCount = symptoms.filter(s => s.severity === 'medium').length;
    
    if (highCount > 0) return 'high';
    if (mediumCount > 0) return 'medium';
    return 'low';
  };

  // Show loader while checking authentication
  if (authLoading) {
    return (
      <div className="triage-history-container">
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
    <div className="triage-history-container">
      <header className="triage-history-header">
        <h1>Assessment History</h1>
        <p className="history-subtitle">
          Review your previous health assessments and recommendations
        </p>
      </header>

      <main className="triage-history-main">
        {/* Loading State */}
        {loading && (
          <div className="loading-section" role="status" aria-live="polite">
            <Loader />
            <p>Loading your assessment history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-section" role="alert" aria-live="polite">
            <div className="error-message">
              <span className="error-icon">⚠</span>
              <div className="error-content">
                <h3>Unable to Load History</h3>
                <p>{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="retry-btn"
              aria-label="Retry loading triage history"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && triageHistory.length === 0 && (
          <div className="empty-state" role="region" aria-labelledby="empty-heading">
            <div className="empty-content">
              <div className="empty-icon">📋</div>
              <h2 id="empty-heading">No Assessment History</h2>
              <p>You haven't completed any health assessments yet.</p>
              <button
                onClick={() => navigate('/triage')}
                className="start-assessment-btn"
                aria-label="Start your first health assessment"
              >
                Start Your First Assessment
              </button>
            </div>
          </div>
        )}

        {/* History List */}
        {!loading && !error && triageHistory.length > 0 && (
          <div className="history-list" role="main">
            <div className="history-stats">
              <p className="stats-text">
                Showing {triageHistory.length} assessment{triageHistory.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="history-entries">
              {triageHistory.map((entry) => {
                const overallSeverity = calculateOverallSeverity(entry.symptoms);
                const severityBadge = getSeverityBadge(overallSeverity);
                
                return (
                  <article 
                    key={entry._id}
                    className="history-entry"
                    aria-labelledby={`entry-${entry._id}-heading`}
                  >
                    <header className="entry-header">
                      <div className="entry-date-severity">
                        <h3 id={`entry-${entry._id}-heading`} className="entry-date">
                          {formatDate(entry.createdAt)}
                        </h3>
                        <div 
                          className={`severity-badge severity-${severityBadge.color}`}
                          role="img"
                          aria-label={severityBadge.label}
                        >
                          <span className="severity-icon">{severityBadge.icon}</span>
                          <span className="severity-text">{overallSeverity}</span>
                        </div>
                      </div>
                    </header>

                    <section className="entry-content">
                      {/* Symptoms */}
                      <div className="symptoms-section">
                        <h4 className="symptoms-heading">
                          Symptoms Reported ({entry.symptoms?.length || 0})
                        </h4>
                        {entry.symptoms && entry.symptoms.length > 0 ? (
                          <ul className="symptoms-list" role="list">
                            {entry.symptoms.map((symptom) => (
                              <li 
                                key={symptom.id}
                                className="symptom-item"
                                role="listitem"
                              >
                                <span className="symptom-name">{symptom.name}</span>
                                <span className={`symptom-severity symptom-${symptom.severity}`}>
                                  {symptom.severity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-symptoms">No symptoms recorded</p>
                        )}
                      </div>

                      {/* Recommendation */}
                      {entry.recommendation && (
                        <div className="recommendation-section">
                          <h4 className="recommendation-heading">Recommendation</h4>
                          <div className="recommendation-content">
                            {entry.recommendation.urgency && (
                              <div className={`urgency-level urgency-${entry.recommendation.urgency}`}>
                                <span className="urgency-label">
                                  {entry.recommendation.urgency.charAt(0).toUpperCase() + 
                                   entry.recommendation.urgency.slice(1)} Priority
                                </span>
                              </div>
                            )}
                            <p className="recommendation-text">
                              {entry.recommendation.message || entry.recommendation.description}
                            </p>
                            {entry.recommendation.nextSteps && (
                              <div className="next-steps">
                                <h5>Next Steps:</h5>
                                <ul>
                                  {entry.recommendation.nextSteps.map((step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="entry-footer">
                        <div className="entry-meta">
                          {entry.triageId && (
                            <span className="triage-id">
                              Assessment ID: {entry.triageId}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              console.log('Navigating to:', `/triage/results/${entry._id}`);
                              navigate(`/triage/results/${entry._id}`);
                            }}
                            className="view-details-btn"
                            aria-label={`View detailed results for assessment from ${formatDate(entry.createdAt)}`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </section>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* New Assessment CTA */}
      {!loading && !error && triageHistory.length > 0 && (
        <div className="new-assessment-cta" role="complementary">
          <div className="cta-content">
            <h3>Need Another Assessment?</h3>
            <p>Start a new health assessment if your symptoms have changed.</p>
            <button
              onClick={() => navigate('/triage')}
              className="new-assessment-btn"
              aria-label="Start a new health assessment"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      )}

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

export default TriageHistory;