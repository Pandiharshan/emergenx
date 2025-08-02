import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Triage.css';

const Triage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Trigger entrance animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartAssessment = () => {
    navigate('/triage/form');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="triage-wrapper">
        <main className="triage-container">
          <div className="triage-loader">
            <div className="loader-spinner"></div>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="triage-wrapper">
      <main className="triage-container">
        <div className={`triage-content ${isVisible ? 'fade-in' : ''}`}>
          
          {/* Hero Section */}
          <section className="triage-hero">
            <div className="hero-content">
              <div className="hero-icon">
                <div className="medical-icon">🩺</div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring delay-1"></div>
              </div>
              
              <h1 className="hero-title">
                Health Assessment Center
              </h1>
              
              <p className="hero-subtitle">
                Get personalized health recommendations based on your symptoms
              </p>
            </div>
          </section>

          {/* Welcome Card */}
          <section className="welcome-card">
            <div className="card-header">
              <div className="card-icon">🧬</div>
              <h2>Welcome to EmergenX</h2>
            </div>
            
            <div className="card-content">
              <p className="welcome-text">
                Hello <strong>{user.name}</strong>! Our intelligent emergency assessment system will help you 
                understand your symptoms and provide guidance on the appropriate level of care needed.
              </p>
            </div>
          </section>

          {/* What is Triage Section */}
          <section className="info-section">
            <div className="info-grid">
              
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <h3>What is Emergency Assessment?</h3>
                <p>
                  Emergency assessment is a process that helps determine the urgency of your medical needs. 
                  It assesses your symptoms to recommend whether you need immediate care, 
                  can wait for a regular appointment, or can manage your condition at home.
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">⚡</div>
                <h3>Why is it Important?</h3>
                <p>
                  Proper emergency assessment ensures you get the right care at the right time. It helps 
                  avoid unnecessary emergency visits while ensuring serious conditions 
                  receive prompt attention, improving outcomes and reducing healthcare costs.
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">🔒</div>
                <h3>Safe & Confidential</h3>
                <p>
                  Your health information is encrypted and secure. Our system follows 
                  medical privacy standards to protect your data while providing 
                  accurate assessments based on established medical protocols.
                </p>
              </div>

            </div>
          </section>

          {/* Instructions Section */}
          <section className="instructions-section">
            <h2 className="instructions-title">How It Works</h2>
            
            <div className="instructions-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Describe Your Symptoms</h4>
                  <p>Tell us about your current symptoms, their severity, and how long you've been experiencing them.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Answer Follow-up Questions</h4>
                  <p>Our system will ask relevant questions to better understand your condition and medical history.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Get Your Assessment</h4>
                  <p>Receive a personalized recommendation on the appropriate level of care and next steps.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Medical Illustration Placeholder */}
          <section className="illustration-section">
            <div className="illustration-placeholder">
              <div className="illustration-icon">🏥</div>
              <p>Professional Medical Assessment</p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-card">
              <div className="cta-content">
                <h2>Ready to Start Your Assessment?</h2>
                <p>
                  Take the first step towards better health management. 
                  The assessment takes about 5-10 minutes to complete.
                </p>
                
                <button 
                  className="start-assessment-btn"
                  onClick={handleStartAssessment}
                  aria-label="Start health assessment"
                >
                  <span className="btn-icon">🚀</span>
                  Start Assessment
                </button>
                
                <div className="cta-note">
                  <span className="note-icon">ℹ️</span>
                  <small>
                    This assessment is for informational purposes only and does not replace professional medical advice.
                  </small>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Triage;