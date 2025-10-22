export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  joinDate: string;
}

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  snippet: string;
  isExplicit: boolean;
  qualityScore?: number;
}

export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  isExplicit: boolean;
}

export interface CodeResult {
  id: string;
  repository: string;
  filePath: string;
  language: string;
  url: string;
  codeSnippet: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface CommunityData {
  votes: number;
  tags: string[];
  comments: Comment[];
  reports: number;
}

export interface Suggestion {
  correction?: string;
  suggestions?: string[];
}
