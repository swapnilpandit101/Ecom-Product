import React from 'react';
import './PrimaryButton.css';

function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      className={`primary-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="primary-button__content">{children}</span>
    </button>
  );
}

export default PrimaryButton;
