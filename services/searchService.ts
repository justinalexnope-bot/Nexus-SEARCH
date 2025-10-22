import { SearchResult } from '../types';

// Using a LibreX/SearXNG instance.
const LIBREX_API_URL = 'https://search.leptons.xyz/api.php';

// Define the structure of the API response from LibreX
interface LibreXResult {
  url: string;
  title: string;
  description: string;
  // We can ignore other fields
}

async function parseLibreXResponse(response: Response, page: number): Promise<SearchResult[]> {
    const data: LibreXResult[] = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    return data
      .filter(result => result.url && result.title)
      .map((result, index): SearchResult => ({
          id: `${result.url}-${page}-${index}`,
          title: result.title,
          url: result.url,
          snippet: result.description || 'No snippet available.',
          isExplicit: false,
      }));
}

export const fetchResults = async (query: string, page: number = 1): Promise<SearchResult[]> => {
  // The LibreX API might not support pagination reliably, but we can try.
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    page: page.toString(),
  });

  console.log(`Fetching web results from LibreX for: "${query}", page: ${page}`);
  
  try {
    const response = await fetch(`${LIBREX_API_URL}?${params.toString()}`);

    if (!response.ok) {
      // Try a different instance if the primary one fails
      console.warn('Primary LibreX instance failed, trying fallback...');
      const fallbackResponse = await fetch(`https://search.iblog.gg/api.php?${params.toString()}`);
      if (!fallbackResponse.ok) {
          throw new Error(`LibreX API request failed on both primary and fallback instances with status ${fallbackResponse.status}`);
      }
      return await parseLibreXResponse(fallbackResponse, page);
    }
    
    return await parseLibreXResponse(response, page);

  } catch (error) {
    console.error("Error fetching web search results from LibreX:", error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error or CORS issue connecting to the LibreX API. The service may be temporarily down.");
    }
    throw new Error("Failed to fetch web search results from the LibreX API.");
  }
};
