import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTriageHistory } from '../services/triageService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTriage, setRecentTriage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTriage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const history = await getTriageHistory();
        
        // Get the most recent triage if available
        if (history && history.length > 0) {
          setRecentTriage(history[0]);
        }
      } catch (err) {
        console.error('Error fetching recent triage:', err);
        setError('Failed to load recent triage data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTriage();
  }, []);

  const handleStartNewTriage = () => {
    navigate('/triage');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#fd7e14';
      case 'low':
        return '#198754';
      default:
        return '#6c757d';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loader">
          <div className="loader-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="welcome-subtitle">
            Your health assessment dashboard is ready to help you make informed decisions about your care.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card primary-action">
            <div className="action-icon">🏥</div>
            <h3>Start New Assessment</h3>
            <p>Begin a new health triage assessment to get personalized care recommendations.</p>
            <button 
              className="action-button primary"
              onClick={handleStartNewTriage}
            >
              Start New Triage
            </button>
          </div>

          <div className="action-card secondary-action">
            <div className="action-icon">📋</div>
            <h3>View History</h3>
            <p>Review your previous assessments and track your health journey over time.</p>
            <button 
              className="action-button secondary"
              onClick={handleViewHistory}
            >
              View Full History
            </button>
          </div>
        </div>

        {/* Recent Triage Summary */}
        <div className="recent-triage-section">
          <h2>Recent Assessment</h2>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {!error && recentTriage ? (
            <div className="recent-triage-card">
              <div className="triage-header">
                <div className="triage-priority">
                  <span className="priority-icon">
                    {getPriorityIcon(recentTriage.priority)}
                  </span>
                  <span 
                    className="priority-text"
                    style={{ color: getPriorityColor(recentTriage.priority) }}
                  >
                    {recentTriage.priority} Priority
                  </span>
                </div>
                <div className="triage-date">
                  {formatDate(recentTriage.createdAt)}
                </div>
              </div>
              
              <div className="triage-content">
                <div className="triage-symptoms">
                  <h4>Symptoms Reported:</h4>
                  <div className="symptoms-list">
                    {recentTriage.symptoms?.map((symptom, index) => (
                      <span key={index} className="symptom-tag">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="triage-recommendation">
                  <h4>Recommendation:</h4>
                  <p>{recentTriage.recommendation}</p>
                </div>
              </div>
              
              <div className="triage-actions">
                <button 
                  className="view-details-btn"
                  onClick={handleViewHistory}
                >
                  View Details
                </button>
              </div>
            </div>
          ) : !error && (
            <div className="no-triage-card">
              <div className="no-triage-icon">🔍</div>
              <h3>No Previous Assessments</h3>
              <p>You haven't completed any health assessments yet. Start your first triage to get personalized care recommendations.</p>
              <button 
                className="action-button primary"
                onClick={handleStartNewTriage}
              >
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>

        {/* Health Tips */}
        <div className="health-tips-section">
          <h2>Health Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h4>Stay Hydrated</h4>
              <p>Drink at least 8 glasses of water daily to maintain optimal health.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🚶</div>
              <h4>Regular Exercise</h4>
              <p>Aim for 30 minutes of moderate exercise most days of the week.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">😴</div>
              <h4>Quality Sleep</h4>
              <p>Get 7-9 hours of quality sleep each night for better health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;