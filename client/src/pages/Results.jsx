import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import * as triageService from '../services/triageService';
import Loader from '../components/Loader';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Guard: If no id, redirect to dashboard or show a message
  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await triageService.getTriageResult(id);
        console.log('Triage result:', response);
        
        if (response) {
          setResult(response);
        } else {
          throw new Error('No result data received');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err.message || 'Failed to load triage result');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    } else if (location.state?.result) {
      // If result was passed through navigation state, use it
      setResult(location.state.result);
      setLoading(false);
    }
  }, [id, location.state]);

  const handleStartNew = () => {
    navigate('/triage');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (loading) {
    return (
      <div className="results-wrapper">
        <div className="results-container">
          <div className="results-loader">
            <div className="loader-spinner"></div>
            <p>Loading your assessment results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-wrapper">
        <div className="results-container">
          <div className="results-card">
            <div className="error-section" role="alert">
              <h2>Error Loading Results</h2>
              <p>{error}</p>
              <div className="results-actions">
                <button onClick={handleStartNew} className="action-button primary-button">
                  Start New Assessment
                </button>
                <button onClick={handleViewHistory} className="action-button secondary-button">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-wrapper">
        <div className="results-container">
          <div className="results-card">
            <div className="error-section">
              <h2>No Results Found</h2>
              <p>We couldn't find your assessment results. Please try again.</p>
              <div className="results-actions">
                <button onClick={handleStartNew} className="action-button primary-button">
                  Start New Assessment
                </button>
                <button onClick={handleViewHistory} className="action-button secondary-button">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      <div className="results-container">
        <div className="results-card">
          {/* Header Section */}
          <header className="results-header">
            <h1 className="results-title">Assessment Results</h1>
            <p className="results-subtitle">
              Here are your personalized health recommendations based on your symptoms
            </p>
          </header>

          {/* Priority Section */}
          <section className="priority-section">
            <div className="priority-label">Priority Level</div>
            <div className="priority-value">{result.priority}</div>
          </section>

          {/* Symptoms Summary */}
          <section className="symptoms-summary">
            <h2 className="summary-title">Symptoms Reported</h2>
            <div className="symptoms-list">
              {result.symptoms?.map((symptom, index) => (
                <div key={index} className="symptom-tag">
                  {symptom.name || symptom}
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation Section */}
          <section className="recommendation-section">
            <h2 className="recommendation-title">
              <span className="recommendation-icon">💡</span>
              Recommendation
            </h2>
            <div className="recommendation-content">
              {result.recommendation?.message || result.recommendation}
            </div>
          </section>

          {/* Assessment Details */}
          <section className="assessment-details">
            <div className="detail-item">
              <strong>Assessment ID:</strong> {result._id || result.triageId}
            </div>
            <div className="detail-item">
              <strong>Date:</strong> {new Date(result.createdAt).toLocaleString()}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="results-actions">
            <button onClick={handleStartNew} className="action-button primary-button">
              Start New Assessment
            </button>
            <button onClick={handleViewHistory} className="action-button secondary-button">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
