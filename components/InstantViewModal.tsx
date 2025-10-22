import React, { useEffect, useState } from 'react';
import { XIcon, GlobeIcon } from './Icons';

interface InstantViewModalProps {
  url: string;
  onClose: () => void;
}

export const InstantViewModal: React.FC<InstantViewModalProps> = ({ url, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-surface-dark rounded-lg shadow-2xl w-full h-full max-w-6xl flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2 text-sm text-text-secondary-dark truncate">
             <GlobeIcon />
             <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{url}</a>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 bg-gray-700 rounded-full text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
            aria-label="Close Instant View"
          >
            <XIcon />
          </button>
        </header>
        
        <div className="flex-grow relative bg-white">
          {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <p className="text-gray-600">Loading content...</p>
              </div>
          )}
          <iframe
            src={url}
            title="Instant View"
            className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
        <footer className="flex-shrink-0 p-2 text-xs text-center text-text-secondary-dark bg-gray-800">
            Some websites may not load correctly due to security policies. <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">Open in new tab</a> for the best experience.
        </footer>
      </div>
    </div>
  );
};
