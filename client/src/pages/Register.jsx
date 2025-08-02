import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import Loader from '../components/Loader';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
    
    // Clear general register error
    if (registerError) {
      setRegisterError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for registration (exclude confirmPassword)
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      const result = await register(registrationData);
      if (result.success) {
        navigate(`/triage/results/${result._id}`);
      } else {
        setRegisterError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid registration data';
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          setRegisterError(errorMessage);
        }
      } else if (error.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'An account with this email already exists' }));
      } else {
        setRegisterError(
          error.response?.data?.message || 
          error.message || 
          'Network error. Please check your connection and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <div className="logo-icon">
                <span className="medical-cross">⚕</span>
              </div>
              <h1 className="register-title">Join EmergenX</h1>
            </div>
            <p className="register-subtitle">Create your healthcare dashboard account</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form" role="form" noValidate>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                placeholder="Enter your full name"
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

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
                placeholder="Create a secure password"
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
                aria-invalid={!!errors.password}
                autoComplete="new-password"
                disabled={isLoading}
              />
              {errors.password ? (
                <span id="password-error" className="error-message" role="alert">
                  {errors.password}
                </span>
              ) : (
                <span id="password-help" className="help-text">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                placeholder="Confirm your password"
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                aria-invalid={!!errors.confirmPassword}
                autoComplete="new-password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span id="confirm-password-error" className="error-message" role="alert">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {registerError && (
              <div className="register-error" role="alert">
                <span className="error-icon">⚠</span>
                {registerError}
              </div>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
              aria-describedby="register-button-status"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>

            <div className="register-footer">
              <p className="login-link">
                Already have an account?{' '}
                <Link to="/login" className="login-link-text">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;