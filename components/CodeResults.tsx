import React from 'react';
import { CodeResult } from '../types';
import { CodeIcon } from './Icons';

const CodeResultItem: React.FC<{ result: CodeResult; index: number }> = ({ result, index }) => {
  return (
    <div 
      className="bg-surface-dark rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in overflow-hidden"
      style={{ animationDelay: `${index * 100}ms`}}
    >
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="group">
          <p className="text-sm font-semibold text-blue-400 group-hover:underline">{result.repository}</p>
          <p className="text-xs text-text-secondary-dark">{result.filePath}</p>
        </a>
      </div>
      <div className="p-4">
        <pre className="bg-gray-800 text-sm text-text-primary-dark p-3 rounded-md overflow-x-auto">
          <code>{result.codeSnippet}</code>
        </pre>
      </div>
       <div className="px-4 pb-3 text-right">
          <span className="text-xs font-semibold bg-gray-700 text-text-secondary-dark px-2 py-1 rounded-full">{result.language}</span>
       </div>
    </div>
  );
};

const CodeResultItemSkeleton: React.FC = () => {
    return (
        <div className="bg-surface-dark p-4 rounded-lg shadow-md">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="space-y-2 p-3 bg-gray-800 rounded-md">
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div>
        </div>
    );
}

interface CodeResultsProps {
  results: CodeResult[];
  isLoading: boolean;
}

export const CodeResults: React.FC<CodeResultsProps> = ({ results, isLoading }) => {
  if (isLoading && results.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <CodeResultItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="text-center p-8 bg-surface-dark rounded-lg">
        <CodeIcon />
        <p className="mt-4 text-text-secondary-dark">No code results found for this query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <CodeResultItem key={result.id} result={result} index={index} />
      ))}
    </div>
  );
};