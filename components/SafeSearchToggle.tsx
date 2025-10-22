import React, { useState } from 'react';
import { SafeSearch } from '../App';

interface SafeSearchToggleProps {
  currentLevel: SafeSearch;
  onChange: (level: SafeSearch) => void;
}

const levels: SafeSearch[] = ['off', 'blur', 'on'];
const levelLabels: Record<SafeSearch, string> = {
  off: 'Off',
  blur: 'Blur',
  on: 'On',
};

export const SafeSearchToggle: React.FC<SafeSearchToggleProps> = ({ currentLevel, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (level: SafeSearch) => {
    onChange(level);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Safe Search: <span className="font-semibold text-text-primary-dark">{levelLabels[currentLevel]}</span></span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-surface-dark border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in" style={{ animationDuration: '0.2s' }}>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`w-full text-left px-4 py-2 text-sm ${currentLevel === level ? 'bg-brand-primary text-white' : 'text-text-secondary-dark hover:bg-gray-700'}`}
            >
              {levelLabels[level]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
