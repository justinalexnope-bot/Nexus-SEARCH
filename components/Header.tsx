import React, { useState } from 'react';
import { User } from '../types';
import { LogInIcon, LogOutIcon, UserIcon, PuzzleIcon } from './Icons';
import { SafeSearchToggle } from './SafeSearchToggle';
import { SafeSearch } from '../App';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  safeSearch: SafeSearch;
  onSafeSearchChange: (level: SafeSearch) => void;
  onOpenProfile: () => void;
  onOpenApiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenAuth, onLogout, safeSearch, onSafeSearchChange, onOpenProfile, onOpenApiModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-surface-dark border-b border-gray-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Nexus Search
        </a>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark"
            title="View API Docs"
          >
            <PuzzleIcon />
            <span>API</span>
          </button>
          <SafeSearchToggle
            currentLevel={safeSearch}
            onChange={onSafeSearchChange}
          />
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                <img src={user.avatarUrl} alt="User avatar" className="h-6 w-6 rounded-full object-cover" />
                <span className="font-medium text-sm">{user.name}</span>
              </button>
              {isMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-surface-dark border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in" 
                  style={{ animationDuration: '0.2s' }}
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                   <button
                    onClick={() => { onOpenProfile(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary-dark hover:bg-gray-700 flex items-center gap-2"
                  >
                    <UserIcon />
                    My Profile
                  </button>
                  <button
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary-dark hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOutIcon />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors"
            >
              <LogInIcon />
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};