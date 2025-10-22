import { useState, useEffect, useCallback } from 'react';
import { CommunityData, Comment, User } from '../types';

const STORAGE_KEY = 'nexusCommunityData';

export const getCommunityDataForAll = (): Record<string, CommunityData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to parse community data from localStorage', error);
    return {};
  }
};

const defaultData: CommunityData = {
  votes: 0,
  tags: [],
  comments: [],
  reports: 0,
};

const REPORT_PENALTY = 5;

export const calculateQualityScore = (data: CommunityData): number => {
  return data.votes - (data.reports * REPORT_PENALTY);
};


export const useCommunityData = (resultId: string) => {
  const [data, setData] = useState<CommunityData>(() => {
    const allData = getCommunityDataForAll();
    return allData[resultId] || { ...defaultData };
  });

  const qualityScore = calculateQualityScore(data);

  const updateStoredData = useCallback((newData: CommunityData) => {
    const allData = getCommunityDataForAll();
    allData[resultId] = newData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [resultId]);

  const vote = (direction: 'up' | 'down') => {
    setData(prev => {
      const newVotes = prev.votes + (direction === 'up' ? 1 : -1);
      const newData = { ...prev, votes: newVotes };
      updateStoredData(newData);
      return newData;
    });
  };

  const addTag = (tag: string) => {
    setData(prev => {
      if (prev.tags.includes(tag)) return prev;
      const newTags = [...prev.tags, tag];
      const newData = { ...prev, tags: newTags };
      updateStoredData(newData);
      return newData;
    });
  };

  const addComment = (text: string, user: User) => {
    setData(prev => {
      const newComment: Comment = {
        id: new Date().toISOString(),
        user,
        text,
        timestamp: new Date().toISOString(),
      };
      const newComments = [...prev.comments, newComment];
      const newData = { ...prev, comments: newComments };
      updateStoredData(newData);
      return newData;
    });
  };

  const report = () => {
    setData(prev => {
      const newReports = (prev.reports || 0) + 1;
      const newData = { ...prev, reports: newReports };
      updateStoredData(newData);
      alert('Result reported. Thank you for your feedback.');
      return newData;
    });
  };

  useEffect(() => {
    const allData = getCommunityDataForAll();
    setData(allData[resultId] || { ...defaultData });
  }, [resultId]);

  return { data, qualityScore, vote, addTag, addComment, report };
};