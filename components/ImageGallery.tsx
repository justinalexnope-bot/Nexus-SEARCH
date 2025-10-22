import React, { useState, useRef, useCallback } from 'react';
import { ImageResult, User } from '../types';
import { ImageModal } from './ImageModal';
import { SafeSearch } from '../App';

const ImageCardSkeleton: React.FC = () => (
  <div className="bg-surface-dark rounded-lg aspect-square overflow-hidden">
    <div className="w-full h-full bg-[linear-gradient(to_right,theme(colors.surface-dark)_8%,theme(colors.gray.700)_18%,theme(colors.surface-dark)_33%)] bg-[length:1000px_100%] animate-shimmer"></div>
  </div>
);

const ImageCard: React.FC<{ result: ImageResult; index: number; onClick: () => void; safeSearch: SafeSearch }> = ({ result, index, onClick, safeSearch }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const shouldBlur = result.isExplicit && safeSearch === 'blur';

  return (
    <button
      onClick={onClick}
      aria-label={`View larger version of ${result.alt}`}
      className={`group block bg-surface-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in aspect-square relative text-left ${shouldBlur ? 'filter blur-md' : ''}`}
      style={{ animationDelay: `${index * 50}ms`}}
    >
      {/* Shimmer Placeholder */}
      <div 
        className={`absolute inset-0 w-full h-full bg-[linear-gradient(to_right,theme(colors.surface-dark)_8%,theme(colors.gray.700)_18%,theme(colors.surface-dark)_33%)] bg-[length:1000px_100%] animate-shimmer transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      
      <img
        src={result.thumbnailUrl}
        alt={result.alt}
        className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 group-hover:transition-transform ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </button>
  );
};

interface ImageGalleryProps {
  results: ImageResult[];
  isLoading: boolean;
  user: User | null;
  safeSearch: SafeSearch;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ results, isLoading, user, safeSearch, onLoadMore, hasMore, isLoadingMore }) => {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  // FIX: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useCallback(node => {
    if (isLoading || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { rootMargin: "200px" }); // Start loading when 200px away from viewport bottom

    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, onLoadMore]);

  if (isLoading && results.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <ImageCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="text-center p-8 bg-surface-dark rounded-lg">
        <p className="text-text-secondary-dark">No image results found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((result, index) => (
          <ImageCard 
            key={result.id} 
            result={result} 
            index={index}
            onClick={() => setSelectedImage(result)}
            safeSearch={safeSearch}
          />
        ))}
        {isLoadingMore && [...Array(4)].map((_, index) => <ImageCardSkeleton key={`loading-${index}`} />)}
      </div>
      
      <div ref={loaderRef} />

      {!isLoadingMore && !hasMore && results.length > 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary-dark">You've reached the end of the gallery.</p>
        </div>
      )}
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage}
          user={user}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};