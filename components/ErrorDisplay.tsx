
import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center p-8 bg-surface-dark rounded-lg border border-red-500/30 shadow-lg">
      <AlertTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-4 text-xl font-semibold text-text-primary-dark">Search Failed</h3>
      <p className="mt-2 text-md text-text-secondary-dark">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-brand-primary"
        aria-label="Retry search"
      >
        <RefreshCwIcon />
        Retry
      </button>
    </div>
  );
};
