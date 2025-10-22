import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { AiSummary } from './components/AiSummary';
import { ImageGallery } from './components/ImageGallery';
import { CodeResults } from './components/CodeResults';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Header } from './components/Header';
import { SpellCorrection } from './components/SpellCorrection';
import { ThinkingModeToggle } from './components/ThinkingModeToggle';
import { ProfileModal } from './components/ProfileModal';
import { InstantViewModal } from './components/InstantViewModal';
import { AuthModal, LoginCredentials, SignUpData } from './components/AuthModal';
import { ApiModal } from './components/ApiModal';
import { fetchResults } from './services/searchService';
import { fetchImageResults } from './services/imageSearchService';
import { fetchCodeResults } from './services/codeSearchService';
import { getSuggestions } from './services/suggestionService';
import { nexusSearch } from './services/publicApiService';
import { SearchResult, ImageResult, CodeResult, User } from './types';
import { ArchitecturesIcon, DatabaseIcon, DomainIcon, SearchIcon, SpiderIcon, ImageIcon, WebIcon, YouTubeIcon, DiscordIcon, MailIcon, CodeIcon } from './components/Icons';
import { SearchHistory } from './components/SearchHistory';
import { getUsers, saveUsers, getCurrentUser, saveCurrentUser, clearCurrentUser, StoredUser } from './services/authService';

export type SearchType = 'web' | 'image' | 'code';
export type SafeSearch = 'off' | 'on' | 'blur';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [codeResults, setCodeResults] = useState<CodeResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<SearchType>('web');
  const [user, setUser] = useState<User | null>(null);
  const [safeSearch, setSafeSearch] = useState<SafeSearch>('blur');
  const [spellCorrection, setSpellCorrection] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [instantViewUrl, setInstantViewUrl] = useState<string | null>(null);

  const [webPage, setWebPage] = useState(1);
  const [imagePage, setImagePage] = useState(1);
  const [hasMoreWeb, setHasMoreWeb] = useState(true);
  const [hasMoreImage, setHasMoreImage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Expose public API on the window object
    (window as any).nexusApi = {
      search: nexusSearch,
    };
    console.log("Nexus Search API is available. Use `await window.nexusApi.search(query, options)` in the console.");

    // Load user session
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    // Load safe search setting
    const savedSafeSearch = localStorage.getItem('nexusSafeSearch');
    if (savedSafeSearch) {
      setSafeSearch(savedSafeSearch as SafeSearch);
    }
    // Load search history
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
      setSearchHistory([]);
    }
  }, []);

  const handleSignUp = async (data: SignUpData): Promise<void> => {
    const users = getUsers();
    if (users.find(u => u.name.toLowerCase() === data.username.toLowerCase())) {
      throw new Error("Username already exists.");
    }
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const avatarUrl = data.avatar ? await fileToBase64(data.avatar) : `https://api.dicebear.com/8.x/bottts/svg?seed=${data.username}`;
    const bannerUrl = data.banner ? await fileToBase64(data.banner) : undefined;
    
    const newUser: StoredUser = {
      id: Date.now().toString(),
      name: data.username,
      passwordHash: data.password, // In a real app, hash this securely!
      avatarUrl,
      bannerUrl,
      bio: `A new user exploring the digital nexus.`,
      joinDate: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    saveCurrentUser(newUser);
    setUser(newUser);
    setIsAuthModalOpen(false);
  };
  
  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
      const users = getUsers();
      const foundUser = users.find(u => u.name.toLowerCase() === credentials.username.toLowerCase());
      
      if (!foundUser || foundUser.passwordHash !== credentials.password) {
          throw new Error("Invalid username or password.");
      }
      
      saveCurrentUser(foundUser);
      setUser(foundUser);
      setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    clearCurrentUser();
  };
  
  const handleSafeSearchChange = (level: SafeSearch) => {
    setSafeSearch(level);
    localStorage.setItem('nexusSafeSearch', level);
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setSearchHistory(prevHistory => {
        const updatedHistory = [searchQuery, ...prevHistory.filter(item => item !== searchQuery)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
    });

    setQuery(searchQuery);
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setResults([]);
    setImageResults([]);
    setCodeResults([]);
    setWebPage(1);
    setImagePage(1);
    setHasMoreWeb(true);
    setHasMoreImage(true);
    setSpellCorrection(null);
    setSearchType('web');

    try {
      const [searchResults, fetchedImageResults, fetchedCodeResults, suggestionResult] = await Promise.all([
        fetchResults(searchQuery, 1),
        fetchImageResults(searchQuery, 1),
        fetchCodeResults(searchQuery),
        getSuggestions(searchQuery)
      ]);
      
      setResults(searchResults);
      if (searchResults.length < 5) setHasMoreWeb(false);
      
      setImageResults(fetchedImageResults);
      if (fetchedImageResults.length < 4) setHasMoreImage(false);

      setCodeResults(fetchedCodeResults);

      if (suggestionResult.correction) {
        setSpellCorrection(suggestionResult.correction);
      }

    } catch (err) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadMoreWeb = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMoreWeb) return;

    setIsLoadingMore(true);
    const nextPage = webPage + 1;
    setWebPage(nextPage);

    try {
      const newResults = await fetchResults(query, nextPage);
      setResults(prev => [...prev, ...newResults]);
      if (newResults.length < 5) {
        setHasMoreWeb(false);
      }
    } catch (err) {
      console.error("Failed to load more web results", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMoreWeb, query, webPage]);

  const handleLoadMoreImages = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMoreImage) return;

    setIsLoadingMore(true);
    const nextPage = imagePage + 1;
    setImagePage(nextPage);

    try {
      const newImageResults = await fetchImageResults(query, nextPage);
      setImageResults(prev => [...prev, ...newImageResults]);
      if (newImageResults.length < 4) {
        setHasMoreImage(false);
      }
    } catch (err) {
      console.error("Failed to load more image results", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMoreImage, query, imagePage]);

  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  const handleRetry = useCallback(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query, handleSearch]);

  const filteredWebResults = useMemo(() => {
    if (safeSearch === 'on') {
      return results.filter(r => !r.isExplicit);
    }
    return results;
  }, [results, safeSearch]);

  const filteredImageResults = useMemo(() => {
    if (safeSearch === 'on') {
      return imageResults.filter(r => !r.isExplicit);
    }
    return imageResults;
  }, [imageResults, safeSearch]);
  
  const techStack = [
    { name: 'Crawler: Python + Scrapy', icon: <SpiderIcon /> },
    { name: 'Indexer: Elasticsearch', icon: <SearchIcon /> },
    { name: 'Backend: FastAPI', icon: <ArchitecturesIcon /> },
    { name: 'Frontend: React + Tailwind', icon: <ArchitecturesIcon /> },
    { name: 'Database: PostgreSQL', icon: <DatabaseIcon /> },
    { name: 'YouTube Support', icon: <YouTubeIcon /> },
    { name: 'Discord Integration', icon: <DiscordIcon /> },
    { name: 'Gmail Service', icon: <MailIcon /> },
    { name: 'Domain: Custom Domain', icon: <DomainIcon /> },
  ];

  const TabButton: React.FC<{ type: SearchType; label: string; icon: React.ReactNode }> = ({ type, label, icon }) => (
    <button
      onClick={() => setSearchType(type)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-t-md ${
        searchType === type
          ? 'border-b-2 border-brand-primary text-text-primary-dark'
          : 'text-text-secondary-dark hover:text-text-primary-dark'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background-dark font-sans">
      <Header 
        user={user} 
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout} 
        safeSearch={safeSearch}
        onSafeSearchChange={handleSafeSearchChange}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />
      <main className={`container mx-auto px-4 py-8 md:py-12 transition-all duration-500 ${!hasSearched ? 'flex flex-col items-center justify-center min-h-[calc(100vh-80px)]' : ''}`}>
        <div className={`w-full max-w-4xl transition-all duration-500 ${hasSearched ? 'mb-8' : 'mb-4'}`}>
          {!hasSearched && (
            <>
              <div className="flex items-center justify-center mb-4">
                 <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Nexus Search
                </h1>
              </div>
              <p className="text-center text-text-secondary-dark mb-8">
                An advanced, AI-powered search engine concept.
              </p>
            </>
          )}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={query} />
          {!hasSearched && (
            <SearchHistory 
              history={searchHistory}
              onHistoryClick={handleSearch}
              onClearHistory={handleClearHistory}
            />
          )}
        </div>

        {hasSearched && (
          <div className="w-full max-w-4xl animate-fade-in">
            {error ? (
              <ErrorDisplay message={error} onRetry={handleRetry} />
            ) : (
              <>
                {spellCorrection && (
                  <SpellCorrection 
                    originalQuery={query}
                    correctedQuery={spellCorrection}
                    onCorrectedSearch={handleSearch}
                  />
                )}
                <div className="border-b border-gray-700/50 mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <TabButton type="web" label="Web" icon={<WebIcon />} />
                    <TabButton type="image" label="Images" icon={<ImageIcon />} />
                    <TabButton type="code" label="Code" icon={<CodeIcon />} />
                  </div>
                  {searchType === 'web' && (
                    <ThinkingModeToggle
                      isEnabled={isThinkingMode}
                      onChange={setIsThinkingMode}
                    />
                  )}
                </div>
                
                {searchType === 'web' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <SearchResults
                        results={filteredWebResults}
                        isLoading={isLoading}
                        user={user}
                        safeSearch={safeSearch}
                        onLoadMore={handleLoadMoreWeb}
                        hasMore={hasMoreWeb}
                        isLoadingMore={isLoadingMore}
                        onInstantView={setInstantViewUrl}
                      />
                    </div>
                    <div>
                      <AiSummary 
                        query={query} 
                        isThinkingMode={isThinkingMode} 
                      />
                    </div>
                  </div>
                )}

                {searchType === 'image' && (
                  <ImageGallery
                    results={filteredImageResults}
                    isLoading={isLoading}
                    user={user}
                    safeSearch={safeSearch}
                    onLoadMore={handleLoadMoreImages}
                    hasMore={hasMoreImage}
                    isLoadingMore={isLoadingMore}
                  />
                )}

                {searchType === 'code' && (
                  <CodeResults results={codeResults} isLoading={isLoading} />
                )}
              </>
            )}
          </div>
        )}

        {!hasSearched && !error && (
          <div className="mt-16 text-center animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary-dark">Powered by a Modern Tech Stack</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-surface-dark p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-lg hover:bg-gray-800 transition-colors">
                  <div className="h-8 w-8 text-blue-400 mb-2">{tech.icon}</div>
                  <span className="text-sm text-text-secondary-dark">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {isProfileModalOpen && user && (
        <ProfileModal
          user={user}
          history={searchHistory}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
        />
      )}
      {instantViewUrl && (
        <InstantViewModal
          url={instantViewUrl}
          onClose={() => setInstantViewUrl(null)}
        />
      )}
      {isApiModalOpen && (
        <ApiModal onClose={() => setIsApiModalOpen(false)} />
      )}
    </div>
  );
}