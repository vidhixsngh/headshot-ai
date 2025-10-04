import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Processing...',
  progress,
  size = 'medium'
}) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-container">
        <div className="spinner"></div>
        {progress !== undefined && (
          <div className="progress-ring">
            <svg className="progress-svg" viewBox="0 0 100 100">
              <circle
                className="progress-circle"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                className="progress-circle-fill"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};
