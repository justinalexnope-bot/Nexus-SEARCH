import React from 'react';

interface SpellCorrectionProps {
  originalQuery: string;
  correctedQuery: string;
  onCorrectedSearch: (query: string) => void;
}

export const SpellCorrection: React.FC<SpellCorrectionProps> = ({ correctedQuery, onCorrectedSearch }) => {
  return (
    <div className="mb-6 p-3 bg-surface-dark rounded-lg text-sm">
      <span className="text-text-secondary-dark">Did you mean: </span>
      <button
        onClick={() => onCorrectedSearch(correctedQuery)}
        className="text-blue-400 hover:underline font-semibold"
      >
        {correctedQuery}
      </button>
    </div>
  );
};