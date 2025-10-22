import React, { useState, useEffect } from 'react';
import { SparklesIcon, BrainCircuitIcon } from './Icons';
import { generateGroundedSummary, generateDeepDiveSummary } from '../services/geminiService';

interface AiSummaryProps {
  query: string;
  isThinkingMode: boolean;
}

const SummarySkeleton: React.FC = () => (
    <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
    </div>
);

export const AiSummary: React.FC<AiSummaryProps> = ({ query, isThinkingMode }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      setSummary('');

      try {
        if (isThinkingMode) {
          const deepDiveSummary = await generateDeepDiveSummary(query);
          setSummary(deepDiveSummary);
        } else {
          const groundedSummary = await generateGroundedSummary(query);
          setSummary(groundedSummary);
        }
      } catch (e) {
        setError("Could not generate AI summary for this topic.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [query, isThinkingMode]);

  const TitleIcon = isThinkingMode ? BrainCircuitIcon : SparklesIcon;
  const titleText = isThinkingMode ? "AI Deep Dive" : "AI Summary";

  return (
    <div className="bg-surface-dark border border-gray-700 p-4 rounded-lg sticky top-8">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <TitleIcon />
        <span className="ml-2">{titleText}</span>
      </h3>
      <div>
        {isLoading ? (
          <SummarySkeleton />
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <p className="text-text-secondary-dark text-sm leading-relaxed">{summary}</p>
        )}
      </div>
    </div>
  );
};
