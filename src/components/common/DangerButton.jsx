import React from 'react';
import './DangerButton.css';

function DangerButton({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      className={`danger-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="danger-button__content">{children}</span>
    </button>
  );
}

export default DangerButton;
