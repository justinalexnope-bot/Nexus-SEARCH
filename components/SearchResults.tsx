import React, { useMemo, useRef, useCallback } from 'react';
import { SearchResult, User } from '../types';
import { SearchResultItem, SearchResultItemSkeleton } from './SearchResultItem';
import { SafeSearch } from '../App';
import { getCommunityDataForAll, calculateQualityScore } from '../hooks/useCommunityData';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  user: User | null;
  safeSearch: SafeSearch;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onInstantView: (url: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, user, safeSearch, onLoadMore, hasMore, isLoadingMore, onInstantView }) => {

  // FIX: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useCallback(node => {
    if (isLoading || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, onLoadMore]);

  const sortedResults = useMemo(() => {
    if (!results || results.length === 0) {
      return [];
    }
    const allCommunityData = getCommunityDataForAll();
    
    const enrichedResults = results.map(result => {
      const communityData = allCommunityData[result.id];
      const qualityScore = communityData ? calculateQualityScore(communityData) : 0;
      return { ...result, qualityScore };
    });

    return enrichedResults.sort((a, b) => b.qualityScore - a.qualityScore);
  }, [results]);

  if (isLoading && results.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, index) => (
          <SearchResultItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="text-center p-8 bg-surface-dark rounded-lg">
        <p className="text-text-secondary-dark">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedResults.map((result, index) => (
        <SearchResultItem 
          key={result.id} 
          result={result} 
          index={index} 
          user={user} 
          safeSearch={safeSearch}
          onInstantView={onInstantView}
        />
      ))}
      
      <div ref={loaderRef} /> 
            
      {isLoadingMore && (
        <div className="space-y-6">
          <SearchResultItemSkeleton />
          <SearchResultItemSkeleton />
        </div>
      )}
      
      {!isLoadingMore && !hasMore && results.length > 0 && (
        <div className="text-center py-4">
          <p className="text-text-secondary-dark text-sm">You've reached the end of the results.</p>
        </div>
      )}
    </div>
  );
};