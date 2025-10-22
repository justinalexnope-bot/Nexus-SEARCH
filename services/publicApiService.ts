import { fetchResults } from './searchService';
import { fetchImageResults } from './imageSearchService';
import { fetchCodeResults } from './codeSearchService';
import { SearchResult, ImageResult, CodeResult } from '../types';

type SearchType = 'web' | 'image' | 'code' | 'all';

interface SearchOptions {
  type?: SearchType;
}

interface ApiError {
    error: string;
}

interface ApiResponse {
  query: string;
  results: {
    web?: SearchResult[] | ApiError;
    image?: ImageResult[] | ApiError;
    code?: CodeResult[] | ApiError;
  };
}

export async function nexusSearch(query: string, options: SearchOptions = {}): Promise<ApiResponse> {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('A valid search query string is required.');
  }

  const searchType = options.type || 'web';
  
  const response: ApiResponse = {
    query,
    results: {},
  };

  const typesToFetch: ('web' | 'image' | 'code')[] = [];

  if (searchType === 'all') {
    typesToFetch.push('web', 'image', 'code');
  } else if (searchType === 'web' || searchType === 'image' || searchType === 'code') {
    typesToFetch.push(searchType);
  } else {
      throw new Error(`Invalid search type: '${searchType}'. Must be one of 'web', 'image', 'code', or 'all'.`);
  }

  const fetchMap = {
      web: () => fetchResults(query, 1),
      image: () => fetchImageResults(query, 1),
      code: () => fetchCodeResults(query),
  };
  
  const results = await Promise.all(
      typesToFetch.map(type => 
        fetchMap[type]().catch(error => {
            console.error(`API search for type '${type}' failed:`, error);
            // Return a structured error object for the specific type
            return { error: `Failed to fetch ${type} results.` };
        })
      )
  );

  results.forEach((result, index) => {
      const type = typesToFetch[index];
      // FIX: Cast `response.results` to `any` to work around a TypeScript limitation.
      // TypeScript cannot correlate that `result` at `index` has the correct type
      // for the `type` key from `typesToFetch` at the same `index`.
      // The logic is sound, so this cast is safe here.
      (response.results as any)[type] = result;
  });

  return response;
}
