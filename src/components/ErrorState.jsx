import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import SecondaryButton from './common/SecondaryButton';
import './ErrorState.css';

function ErrorState({ message = "Something went wrong loading data.", onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <AlertCircle size={28} />
      </div>
      <h3>Error Loading Content</h3>
      <p className="error-state__msg">{message}</p>
      {onRetry && (
        <SecondaryButton className="error-state__action" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </SecondaryButton>
      )}
    </div>
  );
}

export default ErrorState;
