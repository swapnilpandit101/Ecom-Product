import React from 'react';
import './LoadingState.css';

function LoadingState({ count = 6 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card loading-state__card">
          <div className="loading-state__skeleton loading-state__skeleton--image"></div>
          <div className="loading-state__skeleton loading-state__skeleton--tag"></div>
          <div className="loading-state__skeleton loading-state__skeleton--title"></div>
          <div className="loading-state__skeleton loading-state__skeleton--price"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingState;
