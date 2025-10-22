import React, { useEffect } from 'react';
import { ImageResult, User } from '../types';
import { XIcon } from './Icons';
import { CommunityToolbar } from './CommunityToolbar';
import { CommentsModal } from './CommentsModal';

interface ImageModalProps {
  image: ImageResult;
  user: User | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, user, onClose }) => {
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="relative bg-surface-dark p-2 rounded-lg shadow-2xl flex flex-col md:flex-row gap-4 max-w-6xl w-full max-h-[90vh] animate-zoom-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 h-9 w-9 bg-brand-primary rounded-full text-white flex items-center justify-center hover:bg-blue-600 transition-colors z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-brand-primary"
            aria-label="Close image view"
          >
            <XIcon />
          </button>

          <div className="flex-shrink-0 w-full md:w-auto md:max-w-[65%]">
            <img
              src={image.url}
              alt={image.alt}
              className="max-w-full max-h-[calc(90vh-2rem)] object-contain rounded"
            />
          </div>

          <div className="flex-grow flex flex-col p-4">
            <a 
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg font-semibold text-text-primary-dark mb-4 hover:underline"
             >
              {image.alt}
            </a>
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-semibold text-text-secondary-dark mb-2">Community Tools</h3>
              <CommunityToolbar 
                result={image}
                user={user}
                onCommentClick={() => setIsCommentsOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {isCommentsOpen && (
        <CommentsModal
          result={image}
          user={user}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
};
