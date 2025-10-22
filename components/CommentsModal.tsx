import React, { useState, useEffect } from 'react';
import { SearchResult, ImageResult, User } from '../types';
import { useCommunityData } from '../hooks/useCommunityData';
import { XIcon, UserIcon } from './Icons';

interface CommentsModalProps {
  result: SearchResult | ImageResult;
  user: User | null;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ result, user, onClose }) => {
  const { data, addComment } = useCommunityData(result.id);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      addComment(newComment.trim(), user);
      setNewComment('');
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-surface-dark p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close comments view"
        >
          <XIcon />
        </button>

        <h2 className="text-xl font-bold mb-1 truncate">{ 'title' in result ? result.title : result.alt }</h2>
        <p className="text-sm text-text-secondary-dark mb-4">Comments ({data.comments.length})</p>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {data.comments.length > 0 ? (
            data.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <UserIcon />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{comment.user.name}</span>
                    <span className="text-xs text-text-secondary-dark">{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-text-primary-dark">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary-dark text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          {user ? (
            <form onSubmit={handleSubmit} className="flex items-start gap-3">
              <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <UserIcon />
              </div>
              <div className="flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:ring-brand-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="mt-2 bg-brand-primary text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-brand-secondary"
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-text-secondary-dark text-sm">You must be logged in to comment.</p>
          )}
        </div>
      </div>
    </div>
  );
};
