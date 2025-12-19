import axios from 'axios';

// Base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Register function
export const register = async (userData) => {
  try {
    console.log('Registering user:', userData);
    const response = await api.post('/api/auth/register', userData);
    console.log('Register response:', response.data);
    
    // Extract user and token from response
    const { data } = response.data;
    
    // Store token in localStorage for persistence
    if (data.token) {
      localStorage.setItem('token', data.token);
      setAuthHeader(data.token);
    }
    
    return {
      success: true,
      data: data,
      message: response.data.message || 'Registration successful'
    };
  } catch (error) {
    console.error('Register error:', error.response || error);
    return handleError(error);
  }
};

// Login function
export const login = async (credentials) => {
  try {
    console.log('Logging in user:', credentials);
    const response = await api.post('/api/auth/login', credentials);
    console.log('Login response:', response.data);
    
    // Extract user and token from response
    const { data } = response.data;
    
    // Store token in localStorage for persistence
    if (data.token) {
      localStorage.setItem('token', data.token);
      setAuthHeader(data.token);
    }
    
    return {
      success: true,
      data: data,
      message: response.data.message || 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error.response || error);
    return handleError(error);
  }
};

// Logout function (clears token from localStorage)
export const logout = () => {
  localStorage.removeItem('token');
  setAuthHeader(null);
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Set authorization header for future requests
export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data.message || 'Request failed',
      errors: error.response.data.errors || []
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
};

// Initialize auth header on app start if token exists
const token = getToken();
if (token) {
  setAuthHeader(token);
}

export default api;
