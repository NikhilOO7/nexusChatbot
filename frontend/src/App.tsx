import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConversationProvider } from './contexts/ConversationContext';
import { useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './utils/ErrorBoundary';
import { ErrorFallback } from './utils/ErrorFallback';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  const handleError = (error: Error) => {
    // Log error to an error tracking service like Sentry
    console.error('Application error:', error);
  };

  return (
    <ErrorBoundary 
      fallback={
        <ErrorFallback 
          message="Something went wrong with the application." 
          resetErrorBoundary={() => window.location.reload()}
        />
      }
      onError={handleError}
    >
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary 
                      fallback={
                        <ErrorFallback 
                          message="Error loading dashboard" 
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      }
                    >
                      <ConversationProvider>
                        <Dashboard />
                      </ConversationProvider>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;