import { Suggestion } from '../types';

const suggestionsData: { [key: string]: string[] } = {
  'reac': ['react', 'react native', 'react hooks', 'react tutorial'],
  'elas': ['elasticsearch', 'elastic stack', 'elastic beanstalk'],
  'fast': ['fastapi', 'fastapi tutorial', 'fastapi vs flask'],
  'yout': ['youtube', 'youtube music', 'youtube tv'],
  'disc': ['discord', 'discord nitro', 'discord bots'],
  'gmai': ['gmail', 'gmail login', 'gmail sign up'],
};

const spellCorrections: { [key: string]: string } = {
  'reacr': 'react',
  'elaticsearch': 'elasticsearch',
  'fastapy': 'fastapi',
  'yutube': 'youtube',
  'disord': 'discord',
  'gmal': 'gmail',
};

export const getSuggestions = (query: string): Promise<Suggestion> => {
  console.log(`Mock fetching suggestions for: "${query}"`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const result: Suggestion = {};
      
      // Check for spell correction
      if (spellCorrections[lowerQuery]) {
        result.correction = spellCorrections[lowerQuery];
      }

      // Find autocomplete suggestions
      const queryPrefix = lowerQuery.slice(0, 4);
      if (suggestionsData[queryPrefix]) {
        result.suggestions = suggestionsData[queryPrefix].filter(s => s.startsWith(lowerQuery));
      } else {
        result.suggestions = [`${lowerQuery} tutorial`, `${lowerQuery} examples`, `what is ${lowerQuery}`];
      }

      resolve(result);
    }, 150); // Simulate a fast network request
  });
};