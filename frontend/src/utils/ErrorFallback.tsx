import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import './ErrorFallback.css';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  message = 'Something went wrong.'
}) => {
  return (
    <div className="error-fallback">
      <div className="error-icon">
        <AlertTriangle size={48} />
      </div>
      <h2>{message}</h2>
      <p className="error-details">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {resetErrorBoundary && (
        <button 
          className="retry-button" 
          onClick={resetErrorBoundary}
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};