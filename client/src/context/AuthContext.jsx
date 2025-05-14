// Updated: 2025-12-19 12:07:14 - refactor: enhance ui API endpoints
// Updated: 2025-12-19 12:06:56 - chore(database): optimize database error handling
// Updated: 2025-12-19 12:06:46 - test(socket): improve socket error handling
// Updated: 2025-12-19 12:06:30 - chore: add socket UI components
// Updated: 2025-12-19 12:06:29 - feat(patient): add dashboard
// Updated: 2025-12-19 12:06:14 - chore: fix api database schema
// Updated: 2025-12-19 12:06:11 - style(triage): implement triage API endpoints
// Updated: 2025-12-19 12:05:46 - test: fix validation patient form
// Updated: 2025-12-19 12:05:41 - refactor(patient): improve patient form in patient
// Updated: 2025-12-19 12:05:37 - perf(triage): enhance triage database schema
// Updated: 2025-12-19 12:05:34 - style(database): update database database schema
// Updated: 2025-12-19 12:05:32 - style(ui): fix ui dashboard
// Updated: 2025-12-19 12:05:24 - chore(database): refactor database schema in database
// Updated: 2025-12-19 12:05:15 - docs: fix validation dashboard
// Updated: 2025-12-19 12:05:10 - fix: improve database patient form
// Updated: 2025-12-19 12:04:59 - test(patient): improve triage system
// Updated: 2025-12-19 12:04:24 - docs(auth): enhance auth authentication
// Updated: 2025-12-19 12:04:15 - fix: improve database database schema
// Updated: 2025-12-19 12:04:10 - fix(patient): add API endpoints
// Updated: 2025-12-19 12:04:02 - perf(patient): implement patient form
// Updated: 2025-12-19 12:03:57 - test(ui): implement triage system (fixes #32)
// Updated: 2025-12-19 12:03:52 - feat(triage): implement UI components in triage (fixes #41)
// Updated: 2025-12-19 12:03:37 - perf(auth): refactor triage system in auth
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        console.log('Loading user from storage...');
        const storedToken = authService.getToken();
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          console.log('Found stored user and token');
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Set auth header for future requests
          authService.setAuthHeader(storedToken);
        } else {
          console.log('No stored user or token found');
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      console.log('Register result:', result);
      
      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);
        
        // Persist user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Set auth header for future requests
        authService.setAuthHeader(result.data.token);
        
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(credentials);
      console.log('Login result:', result);

      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);

        // Persist user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.data.user));

        // Set auth header for future requests
        authService.setAuthHeader(result.data.token);

        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      console.log('Logging out user');
      // Clear auth service token
      authService.logout();
      
      // Clear context state
      setUser(null);
      setToken(null);
      setError(null);
      
      // Remove user data from localStorage
      localStorage.removeItem('user');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, message: 'Logout failed' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue = {
    // State
    user,
    token,
    loading,
    error,
    
    // Methods
    register,
    login,
    logout,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};






















