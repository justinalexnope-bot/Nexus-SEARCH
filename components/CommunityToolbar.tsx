import React, { useState } from 'react';
import { SearchResult, ImageResult, User } from '../types';
import { useCommunityData } from '../hooks/useCommunityData';
import { ChevronUpIcon, ChevronDownIcon, TagIcon, MessageSquareIcon, FlagIcon } from './Icons';

interface CommunityToolbarProps {
  result: SearchResult | ImageResult;
  user: User | null;
  onCommentClick: () => void;
}

export const CommunityToolbar: React.FC<CommunityToolbarProps> = ({ result, user, onCommentClick }) => {
  const { data, vote, addTag, report } = useCommunityData(result.id);
  const [isTagging, setIsTagging] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
      setIsTagging(false);
    }
  };

  const TooltipButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
    className?: string
  }> = ({ onClick, disabled, label, children, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-sm ${
        disabled
          ? 'text-gray-500 cursor-not-allowed'
          : `hover:bg-gray-700 text-text-secondary-dark ${className}`
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-4 border-t border-gray-700/50 pt-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-800 rounded-md">
            <TooltipButton onClick={() => vote('up')} disabled={!user} label="Upvote">
                <ChevronUpIcon />
            </TooltipButton>
            <span className={`text-sm font-bold w-8 text-center ${data.votes > 0 ? 'text-green-400' : data.votes < 0 ? 'text-red-400' : 'text-text-secondary-dark'}`}>
                {data.votes}
            </span>
            <TooltipButton onClick={() => vote('down')} disabled={!user} label="Downvote">
                <ChevronDownIcon />
            </TooltipButton>
        </div>

        <TooltipButton onClick={onCommentClick} label="Comments">
          <MessageSquareIcon />
          <span>{data.comments.length}</span>
        </TooltipButton>

        <TooltipButton onClick={() => setIsTagging(!isTagging)} disabled={!user} label="Add tag">
          <TagIcon />
        </TooltipButton>
      </div>

      <TooltipButton onClick={report} disabled={!user} label="Report result">
        <FlagIcon />
      </TooltipButton>

      {isTagging && user && (
        <form onSubmit={handleTagSubmit} className="mt-2 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-brand-primary focus:outline-none"
            autoFocus
          />
          <button type="submit" className="bg-brand-primary text-white px-3 py-1 rounded-md text-sm font-semibold">Add</button>
        </form>
      )}
    </div>
  );
};
