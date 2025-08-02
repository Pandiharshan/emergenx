import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartTriage = () => {
    navigate('/triage');
  };

  const features = [
    {
      icon: '⚡',
      title: 'Fast Diagnosis',
      description: 'Get preliminary assessment results in minutes, not hours. Our AI analyzes symptoms quickly and efficiently.'
    },
    {
      icon: '📋',
      title: 'Symptom History',
      description: 'Track and manage your symptoms over time. Build a comprehensive health profile for better care.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected. HIPAA-compliant security you can trust.'
    },
    {
      icon: '🧠',
      title: 'Powered by AI',
      description: 'Advanced machine learning algorithms trained on medical data to provide accurate triage recommendations.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Smarter Triage. <span className="highlight">Safer Outcomes.</span>
            </h1>
            <p className="hero-subtitle">
              AI-driven pre-hospital triage assistance for patients and healthcare providers
            </p>
            <button 
              className="cta-button" 
              onClick={handleStartTriage}
              aria-label="Start medical triage assessment"
            >
              <span className="cta-text">Start Triage</span>
              <span className="cta-icon">→</span>
            </button>
          </div>
          <div className="hero-visual">
            <div className="medical-icon">
              <span className="pulse-icon">🩺</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose TriageX?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2 className="mission-title">
              Built for patients. <span className="mission-highlight">Trusted by doctors.</span>
            </h2>
            <p className="mission-description">
              TriageX bridges the gap between patients and healthcare providers by delivering 
              intelligent, preliminary medical assessments. Our platform empowers users to make 
              informed decisions about their health while supporting medical professionals with 
              data-driven insights.
            </p>
            <div className="mission-stats">
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Availability</span>
              </div>
              <div className="stat">
                <span className="stat-number">HIPAA</span>
                <span className="stat-label">Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Take control of your health with intelligent triage assistance.
            </p>
            <button 
              className="cta-button secondary" 
              onClick={handleStartTriage}
              aria-label="Begin your medical triage assessment"
            >
              <span className="cta-text">Begin Assessment</span>
              <span className="cta-icon">🩺</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;