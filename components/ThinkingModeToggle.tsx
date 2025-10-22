import React from 'react';
import { BrainCircuitIcon } from './Icons';

interface ThinkingModeToggleProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const ThinkingModeToggle: React.FC<ThinkingModeToggleProps> = ({ isEnabled, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <BrainCircuitIcon />
      <span className={`text-sm font-medium ${isEnabled ? 'text-cyan-400' : 'text-text-secondary-dark'}`}>
        Deep Dive
      </span>
      <button
        role="switch"
        aria-checked={isEnabled}
        onClick={() => onChange(!isEnabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background-dark ${
          isEnabled ? 'bg-cyan-500' : 'bg-gray-600'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
