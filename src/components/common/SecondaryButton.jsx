import React from 'react';
import './SecondaryButton.css';

function SecondaryButton({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      className={`secondary-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="secondary-button__content">{children}</span>
    </button>
  );
}

export default SecondaryButton;
