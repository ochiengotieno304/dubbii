import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MediaItem, MediaType } from '../types';

const LOCAL_STORAGE_KEY = 'dubbii-watch-later';

interface WatchLaterContextType {
  watchLaterItems: MediaItem[];
  addToWatchLater: (item: MediaItem) => void;
  removeFromWatchLater: (id: string, type: MediaType) => void;
  isWatchLater: (id: string, type: MediaType) => boolean;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const WatchLaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchLaterItems, setWatchLaterItems] = useState<MediaItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const items = localStorage.getItem(LOCAL_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error reading watch later items from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchLaterItems));
    } catch (error) {
      console.error("Error saving watch later items to localStorage:", error);
    }
  }, [watchLaterItems]);

  const addToWatchLater = useCallback((itemToAdd: MediaItem) => {
    setWatchLaterItems(prevItems => {
      if (prevItems.some(item => item.id === itemToAdd.id && item.type === itemToAdd.type)) {
        return prevItems; // Already exists
      }
      // Add essential fields from MediaItem, avoid deeply nested or large objects if not needed
      const simplifiedItem: MediaItem = {
        id: itemToAdd.id,
        title: itemToAdd.title,
        type: itemToAdd.type,
        posterPath: itemToAdd.posterPath,
        releaseDate: itemToAdd.releaseDate,
        voteAverage: itemToAdd.voteAverage,
        genres: itemToAdd.genres.slice(0,2), // Keep a few genres for display
        overview: itemToAdd.overview.substring(0, 150) + (itemToAdd.overview.length > 150 ? '...' : ''), // Truncate overview
        backdropPath: itemToAdd.backdropPath, // Optional, could be omitted for smaller storage
      };
      return [...prevItems, simplifiedItem];
    });
  }, []);

  const removeFromWatchLater = useCallback((id: string, type: MediaType) => {
    setWatchLaterItems(prevItems => prevItems.filter(item => !(item.id === id && item.type === type)));
  }, []);

  const isWatchLater = useCallback((id: string, type: MediaType): boolean => {
    return watchLaterItems.some(item => item.id === id && item.type === type);
  }, [watchLaterItems]);

  return (
    <WatchLaterContext.Provider value={{ watchLaterItems, addToWatchLater, removeFromWatchLater, isWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = (): WatchLaterContextType => {
  const context = useContext(WatchLaterContext);
  if (context === undefined) {
    throw new Error('useWatchLater must be used within a WatchLaterProvider');
  }
  return context;
};