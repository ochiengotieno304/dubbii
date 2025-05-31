import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMedia } from '../services/mediaService';
import { MediaItem } from '../types';
import useDebounce from '../hooks/useDebounce';
import { LoadingSpinner } from './LoadingSpinner';
import { DEFAULT_SEARCH_THUMB_PLACEHOLDER } from '../constants';

interface SuggestionItemProps {
  item: MediaItem;
  onClick: () => void;
  isHighlighted: boolean; // For keyboard navigation
  id?: string; // For aria-activedescendant
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ item, onClick, isHighlighted, id }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsImageLoaded(false); // Reset on item change
  }, [item.id]);

  useEffect(() => {
    if (isHighlighted && ref.current) {
      ref.current.focus(); // For accessibility with keyboard
    }
  }, [isHighlighted]);

  return (
    <div
      ref={ref}
      id={id} // Apply the id here
      onClick={onClick}
      tabIndex={isHighlighted ? 0 : -1} // Make it focusable when highlighted
      className={`px-3 py-2.5 flex items-center space-x-3 cursor-pointer transition-colors duration-150 ease-in-out
                  ${isHighlighted ? 'bg-gray-100 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}
                  focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 rounded-md m-1`}
      role="option"
      aria-selected={isHighlighted}
    >
      <div className="relative w-10 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
        {!isImageLoaded && (
          <div className="absolute inset-0 w-full h-full animate-pulse"></div>
        )}
        <img 
          src={item.posterPath || DEFAULT_SEARCH_THUMB_PLACEHOLDER} 
          alt={item.title} 
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_SEARCH_THUMB_PLACEHOLDER; setIsImageLoaded(true); }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div>
        <p className="font-medium text-sm text-neutral dark:text-gray-100 line-clamp-1">{item.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {item.type === 'movie' ? 'Movie' : 'TV Show'} ({item.releaseDate.substring(0,4)})
        </p>
      </div>
    </div>
  );
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300); // Slightly faster debounce
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchMedia(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
    setHighlightedIndex(-1); // Reset highlight on new query
  }, [debouncedQuery, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (item: MediaItem) => {
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
    navigate(`/media/${item.type}/${item.id}`);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      const trimmedQuery = query.trim();
      setQuery('');
      setSuggestions([]);
      setIsFocused(false);
      navigate(`/browse?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
      }
    }
  };


  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="flex items-center" role="search">
        <input
          type="search" // Use type="search" for better semantics and clear button on some browsers
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search movies & TV..."
          className="w-full px-4 py-2.5 text-sm text-base-content dark:text-gray-100 bg-gray-100 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600/50 rounded-l-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-shadow focus:shadow-md"
          aria-label="Search for movies and TV shows"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isFocused && (isLoading || suggestions.length > 0)}
          aria-activedescendant={highlightedIndex >=0 ? `suggestion-${highlightedIndex}` : undefined}
        />
        <button 
          type="submit"
          className="px-3.5 py-2.5 bg-secondary text-gray-900 rounded-r-lg hover:bg-amber-400 focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-amber-500 focus:outline-none transition-all duration-200 active:scale-95 transform"
          aria-label="Submit search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
      {isFocused && (isLoading || suggestions.length > 0 || (query.length >=2 && !isLoading && !suggestions.length)) && (
        <div 
          className="absolute mt-1.5 w-full bg-primary dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto p-1"
          role="listbox" 
          id="search-suggestions"
        >
          {isLoading && <div className="p-4 flex justify-center"><LoadingSpinner size="sm"/></div>}
          {!isLoading && suggestions.map((item, index) => (
            <SuggestionItem 
              key={item.id}
              id={`suggestion-${index}`} // For aria-activedescendant
              item={item} 
              onClick={() => handleSelectSuggestion(item)} 
              isHighlighted={index === highlightedIndex}
            />
          ))}
          {!isLoading && suggestions.length === 0 && query.length >= 2 && (
            <p className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">No results found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;