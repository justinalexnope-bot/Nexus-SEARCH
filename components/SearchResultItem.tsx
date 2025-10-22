import React, { useState } from 'react';
import { SearchResult, User } from '../types';
import { SafeSearch } from '../App';
import { useCommunityData } from '../hooks/useCommunityData';
import { CommunityToolbar } from './CommunityToolbar';
import { CommentsModal } from './CommentsModal';
import { ShieldCheckIcon, EyeIcon } from './Icons';

interface SearchResultItemProps {
  result: SearchResult;
  index: number;
  user: User | null;
  safeSearch: SafeSearch;
  onInstantView: (url: string) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, index, user, safeSearch, onInstantView }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { data, qualityScore } = useCommunityData(result.id);

  const shouldBlur = result.isExplicit && safeSearch === 'blur';

  const scoreColor = qualityScore > 0 ? 'text-green-400' : qualityScore < 0 ? 'text-red-400' : 'text-text-secondary-dark';

  return (
    <>
      <div 
          className={`bg-surface-dark p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in ${shouldBlur ? 'filter blur-md' : ''}`}
          style={{ animationDelay: `${index * 100}ms`}}
      >
        <div className="flex items-center justify-between">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-grow mr-4"
          >
            <p className="text-sm text-text-secondary-dark truncate">{result.url}</p>
            <h3 className="text-xl font-semibold text-blue-400 group-hover:underline">
              {result.title}
            </h3>
          </a>
          <div className="flex items-center gap-2 flex-shrink-0">
             <button
                onClick={() => onInstantView(result.url)}
                className="p-1.5 text-text-secondary-dark hover:text-brand-primary hover:bg-gray-700 rounded-full transition-colors"
                title="Instant View"
              >
                <EyeIcon />
              </button>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-800 text-sm font-bold ${scoreColor}`}>
              <ShieldCheckIcon />
              <span>{qualityScore}</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-text-secondary-dark">
          {result.snippet}
        </p>

        {data.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.tags.map(tag => (
              <span key={tag} className="bg-gray-700 text-xs text-text-secondary-dark px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <CommunityToolbar
          result={result}
          user={user}
          onCommentClick={() => setIsCommentsOpen(true)}
        />
      </div>
      {isCommentsOpen && (
        <CommentsModal
          result={result}
          user={user}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
};


export const SearchResultItemSkeleton: React.FC = () => {
    return (
        <div className="bg-surface-dark p-4 rounded-lg shadow-md">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-600 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
        </div>
    );
}