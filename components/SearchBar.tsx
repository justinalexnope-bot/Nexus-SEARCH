import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon, TrendingUpIcon } from './Icons';
import { getSuggestions } from '../services/suggestionService';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const searchBarRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedQuery && isFocused) {
      getSuggestions(debouncedQuery).then(result => {
        setSuggestions(result.suggestions || []);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, isFocused]);
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = activeIndex >= 0 && suggestions[activeIndex] ? suggestions[activeIndex] : query;
    onSearch(searchQuery);
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative" ref={searchBarRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web with AI..."
          className={`w-full pl-12 pr-4 py-3 bg-surface-dark border border-gray-700 text-text-primary-dark placeholder-text-secondary-dark focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all ${suggestions.length > 0 ? 'rounded-t-3xl' : 'rounded-full'}`}
          disabled={isLoading}
          autoComplete="off"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <SearchIcon />
        </div>
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:bg-brand-secondary disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-surface-dark border border-t-0 border-gray-700 rounded-b-3xl shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 flex items-center gap-3 ${index === activeIndex ? 'bg-gray-700' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <TrendingUpIcon />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};