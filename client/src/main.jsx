import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Import global styles
import './index.css';
import './App.css';

/**
 * Initialize accessibility features and theme detection
 * This runs before the React app mounts to ensure proper setup
 */
const initializeApp = () => {
  console.log('Initializing app...');
  // Set initial theme based on system preference if no saved preference exists
  const initializeTheme = () => {
    try {
              const savedTheme = localStorage.getItem('emergenx-theme');
      if (!savedTheme) {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = systemPreference ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', initialTheme);
                  localStorage.setItem('emergenx-theme', initialTheme);
      } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (error) {
      console.warn('Could not initialize theme:', error);
      // Fallback to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  // Set up accessibility features
  const initializeAccessibility = () => {
    // Add focus-visible polyfill behavior for better accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Set language attribute for screen readers
    document.documentElement.lang = 'en';

    // Add viewport meta tag for mobile responsiveness if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0';
      document.head.appendChild(viewport);
    }
  };

  // Initialize all features
  initializeTheme();
  initializeAccessibility();
  console.log('App initialization complete');
};

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          color: '#374151'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main application render function
 */
const renderApp = () => {
  console.log('Starting app render...');
  // Get the root element
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error(
      'Root element not found. Make sure there is an element with id="root" in your HTML.'
    );
  }

  // Create React root
  const root = createRoot(rootElement);

  // Render the app with error boundary
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('App rendered successfully');
};

/**
 * Application startup
 */
try {
  console.log('Starting EmergenX application...');
  initializeApp();
  renderApp();
  console.log('EmergenX application started successfully');
} catch (error) {
  console.error('Failed to start EmergenX application:', error);
  
  // Show user-friendly error message
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: #f9fafb;
        color: #374151;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
          <p style="margin-bottom: 16px;">
            EmergenX encountered an error during startup. Please refresh the page or contact support.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background: #2563eb;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}