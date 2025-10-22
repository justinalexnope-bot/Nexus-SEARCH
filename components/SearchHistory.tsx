
import React from 'react';
import { HistoryIcon, TrashIcon } from './Icons';

interface SearchHistoryProps {
  history: string[];
  onHistoryClick: (query: string) => void;
  onClearHistory: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onHistoryClick, onClearHistory }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 animate-fade-in text-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-text-secondary-dark flex items-center">
          <HistoryIcon />
          <span className="ml-2">Recent Searches</span>
        </h4>
        <button
          onClick={onClearHistory}
          className="text-text-secondary-dark hover:text-red-400 transition-colors flex items-center text-xs"
          aria-label="Clear search history"
        >
          <TrashIcon />
          <span className="ml-1">Clear</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item}
            onClick={() => onHistoryClick(item)}
            className="bg-surface-dark px-3 py-1 rounded-full hover:bg-brand-primary hover:text-white transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
