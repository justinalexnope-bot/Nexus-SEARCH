import React, { useEffect } from 'react';
import { User } from '../types';
import { XIcon, CalendarIcon, HistoryIcon } from './Icons';

interface ProfileModalProps {
  user: User;
  history: string[];
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, history, onClose }) => {
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

  const bannerStyle = user.bannerUrl 
    ? { backgroundImage: `url(${user.bannerUrl})` } 
    : {};

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-surface-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-zoom-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1 z-20 hover:bg-black/80"
          aria-label="Close profile view"
        >
          <XIcon />
        </button>
        
        <div className="relative">
            <div className={`h-40 bg-gray-800 bg-cover bg-center`} style={bannerStyle}>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent" />
            </div>
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                <img src={user.avatarUrl} alt="User avatar" className="h-28 w-28 rounded-full border-4 border-surface-dark object-cover" />
            </div>
        </div>

        <div className="pt-20 px-6 pb-6 flex-grow flex flex-col">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2 text-sm text-text-secondary-dark mt-1">
                <CalendarIcon />
                <span>Joined on {new Date(user.joinDate).toLocaleDateString()}</span>
            </div>

            <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p className="text-text-secondary-dark italic">{user.bio}</p>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 sticky top-0 bg-surface-dark py-2">
                    <HistoryIcon />
                    Recent Activity
                </h3>
                {history.length > 0 ? (
                    <ul className="space-y-2">
                    {history.map((item, index) => (
                        <li key={index} className="bg-gray-800 p-3 rounded-md text-sm text-text-primary-dark">
                        Searched for: <span className="font-semibold text-blue-400">"{item}"</span>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-text-secondary-dark text-center py-8">No recent activity.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
