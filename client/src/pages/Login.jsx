// Updated: 2025-12-19 12:04:25 - docs(api): implement api authentication
// Updated: 2025-12-19 12:04:17 - chore(ui): add API endpoints in ui
// Updated: 2025-12-19 12:04:01 - feat(socket): optimize socket dashboard
// Updated: 2025-12-19 12:03:57 - style: fix api authentication (fixes #31)
// Updated: 2025-12-19 12:03:46 - perf(validation): fix error handling in validation
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import Loader from '../components/Loader';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(
        error.response?.data?.message || 
        error.message || 
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <span className="medical-cross">âš•</span>
              </div>
              <h1 className="login-title">EmergenX</h1>
            </div>
            <p className="login-subtitle">Welcome back to your healthcare dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" role="form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
                disabled={isLoading}
              />
              {errors.password && (
                <span id="password-error" className="error-message" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {loginError && (
              <div className="login-error" role="alert">
                <span className="error-icon">âš </span>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              aria-describedby="login-button-status"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <span className="button-arrow">â†’</span>
                </>
              )}
            </button>

            <div className="login-footer">
              <p className="register-link">
                Don't have an account?{' '}
                <Link to="/register" className="register-link-text">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;




