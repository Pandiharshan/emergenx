import React, { Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { TriageProvider } from './context/TriageContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Triage = React.lazy(() => import('./pages/Triage'));
const TriageForm = React.lazy(() => import('./pages/TriageForm'));
const Results = React.lazy(() => import('./pages/Results'));
const TriageHistory = React.lazy(() => import('./pages/TriageHistory'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  console.log('ProtectedRoute - User:', user, 'Loading:', loading);
  
  if (loading) {
    return <Loader />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  console.log('PublicRoute - User:', user, 'Loading:', loading);
  
  if (loading) {
    return <Loader />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get theme from localStorage or system preference
    const getInitialTheme = () => {
      try {
        const savedTheme = localStorage.getItem('triagex-theme');
        if (savedTheme) return savedTheme;
        
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPreference ? 'dark' : 'light';
      } catch (error) {
        console.warn('Could not access localStorage:', error);
        return 'light';
      }
    };

    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme to localStorage
    try {
      localStorage.setItem('triagex-theme', theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`app-wrapper theme-${theme}`} data-theme={theme}>
      {React.cloneElement(children, { theme, toggleTheme })}
    </div>
  );
};

// Main App Component
const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    console.log('App mounted');
    // Get theme from localStorage or system preference
    const getInitialTheme = () => {
      try {
        const savedTheme = localStorage.getItem('triagex-theme');
        if (savedTheme) return savedTheme;
        
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPreference ? 'dark' : 'light';
      } catch (error) {
        console.warn('Could not access localStorage:', error);
        return 'light';
      }
    };

    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setAppLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme to localStorage
    try {
      localStorage.setItem('triagex-theme', theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  console.log('App rendering - Loading:', appLoading, 'Theme:', theme);

  if (appLoading) {
    return (
      <div className="app-loading">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <TriageProvider>
          <div className="app" data-theme={theme}>
            <div className="app-container">
              <Header theme={theme} toggleTheme={toggleTheme} />
              
              <main className="main-content">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/" 
                      element={<Home />} 
                    />
                    <Route 
                      path="/login" 
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      } 
                    />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/triage" 
                      element={
                        <ProtectedRoute>
                          <Triage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/triage/form" 
                      element={
                        <ProtectedRoute>
                          <TriageForm />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/triage/results/:id" 
                      element={
                        <ProtectedRoute>
                          <Results />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/history" 
                      element={
                        <ProtectedRoute>
                          <TriageHistory />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Footer />
            </div>
          </div>
        </TriageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;