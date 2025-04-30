// Updated: 2025-12-19 12:06:43 - style(api): update api UI components (fixes #12)
// Updated: 2025-12-19 12:06:39 - feat(ui): update ui UI components
// Updated: 2025-12-19 12:06:32 - feat(database): enhance patient form in database
// Updated: 2025-12-19 12:06:24 - chore(triage): add error handling in triage
// Updated: 2025-12-19 12:06:10 - docs(auth): optimize UI components
// Updated: 2025-12-19 12:05:57 - style: implement validation dashboard
// Updated: 2025-12-19 12:05:51 - fix(auth): enhance API endpoints in auth
// Updated: 2025-12-19 12:05:44 - style(patient): refactor triage system
// Updated: 2025-12-19 12:05:33 - chore: refactor triage API endpoints
// Updated: 2025-12-19 12:05:01 - feat(validation): fix patient form
// Updated: 2025-12-19 12:04:58 - chore(validation): implement validation authentication
// Updated: 2025-12-19 12:04:39 - chore(auth): refactor UI components
// Updated: 2025-12-19 12:04:19 - chore(socket): refactor error handling
// Updated: 2025-12-19 12:04:07 - chore(ui): fix UI components
// Updated: 2025-12-19 12:04:04 - fix(api): refactor api database schema (fixes #16)
// Updated: 2025-12-19 12:03:49 - style(auth): update UI components in auth
// Updated: 2025-12-19 12:03:40 - feat(database): fix UI components in database
// Updated: 2025-12-19 12:03:38 - style(api): improve database schema in api (fixes #23)
// Updated: 2025-12-19 12:03:38 - feat: refactor database database schema (fixes #34)
// Updated: 2025-12-19 12:03:29 - perf(ui): fix authentication in ui
// Updated: 2025-12-19 12:03:26 - style(ui): optimize patient form
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { TriageProvider } from './context/TriageContext';
import { CallProvider } from './context/CallContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import CallInterface from './components/CallInterface';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Triage = React.lazy(() => import('./pages/Triage'));
const TriageForm = React.lazy(() => import('./pages/TriageForm'));
const Results = React.lazy(() => import('./pages/Results'));
const TriageHistory = React.lazy(() => import('./pages/TriageHistory'));
const Calls = React.lazy(() => import('./pages/Calls'));
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
        const savedTheme = localStorage.getItem('emergenx-theme');
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
      localStorage.setItem('emergenx-theme', theme);
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
          const savedTheme = localStorage.getItem('emergenx-theme');
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
        localStorage.setItem('emergenx-theme', theme);
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
        <CallProvider>
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
                    <Route 
                      path="/calls" 
                      element={
                        <ProtectedRoute>
                          <Calls />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Footer />
              <CallInterface />
            </div>
          </div>
        </TriageProvider>
        </CallProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;




















