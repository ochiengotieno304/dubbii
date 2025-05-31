
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { browseMedia } from '../services/mediaService';
import { MediaItem, Filters, Genre, MediaType } from '../types';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GENRES_LIST, YEARS_LIST, RATINGS_LIST } from '../constants';
import { useLayoutContext } from '../contexts/LayoutContext'; // Import context hook

const FilterPanel: React.FC<{
  currentFilters: Filters;
  onFilterChange: (newFilters: Filters) => void;
}> = ({ currentFilters, onFilterChange }) => {
  const [internalFilters, setInternalFilters] = useState<Filters>(currentFilters);

  useEffect(() => {
    // Exclude sort-related filters from being directly controlled by the panel for now
    const { sort, min_votes, ...displayableFilters } = currentFilters;
    setInternalFilters(displayableFilters);
  }, [currentFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...internalFilters, // Keep existing panel-controlled filters
      [name]: value === '' ? undefined : (name === 'year' || name === 'rating' ? parseInt(value) : value),
    };
    setInternalFilters(newFilters);
    // Pass back only the panel-controlled filters, sort/min_votes are from URL
    onFilterChange(newFilters); 
  };
  
  const handleReset = () => {
    const resetFilters = {}; // Resets only panel-controlled filters
    setInternalFilters(resetFilters);
    onFilterChange(resetFilters); // This will trigger a URL update without sort/min_votes if they are not re-added
  };

  const selectBaseClasses = "w-full p-2.5 bg-gray-50 dark:bg-gray-700/70 text-neutral dark:text-gray-200 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary text-sm transition-shadow focus:shadow-md";

  return (
    <div className="bg-primary dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-xl mb-8">
      <h3 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-5">Filter Options</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="type" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Type</label>
          <select id="type" name="type" value={internalFilters.type || ''} onChange={handleInputChange} className={selectBaseClasses}>
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>
        <div>
          <label htmlFor="genre" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Genre</label>
          <select id="genre" name="genre" value={internalFilters.genre || ''} onChange={handleInputChange} className={selectBaseClasses}>
            <option value="">All Genres</option>
            {GENRES_LIST.map((genre: Genre) => (
              <option key={genre.id} value={genre.name}>{genre.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Year</label>
          <select id="year" name="year" value={internalFilters.year || ''} onChange={handleInputChange} className={selectBaseClasses}>
            <option value="">Any Year</option>
            {YEARS_LIST.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Min. Rating</label>
          <select id="rating" name="rating" value={internalFilters.rating || ''} onChange={handleInputChange} className={selectBaseClasses}>
            <option value="">Any Rating</option>
            {RATINGS_LIST.map(rating => (
              <option key={rating} value={rating}>{rating}+</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
            <button 
                onClick={handleReset}
                className="w-full p-2.5 bg-accent text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-700 focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 active:scale-95 transform text-sm font-medium"
            >
                Reset Filters
            </button>
        </div>
      </div>
    </div>
  );
};

const PaginationButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ onClick, disabled, isActive, children, className = '', ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out transform active:scale-95
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : ''}
        ${isActive ? 'bg-secondary text-gray-900 font-bold shadow-md ring-1 ring-amber-600' : ''}
        ${!disabled && !isActive ? 'bg-primary dark:bg-gray-800 text-neutral dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-base-100' : ''}
        ${className}`}
    >
      {children}
    </button>
  );
};


const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center space-x-1.5 my-8 md:my-10">
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        ariaLabel="Go to previous page"
      >
        Prev
      </PaginationButton>
      {startPage > 1 && (
        <>
          <PaginationButton onClick={() => onPageChange(1)} ariaLabel="Go to page 1">1</PaginationButton>
          {startPage > 2 && <span className="text-gray-500 dark:text-gray-400 px-1">...</span>}
        </>
      )}
      {pageNumbers.map(number => (
        <PaginationButton
          key={number}
          onClick={() => onPageChange(number)}
          isActive={currentPage === number}
          ariaLabel={`Go to page ${number}`}
          aria-current={currentPage === number ? "page" : undefined}
        >
          {number}
        </PaginationButton>
      ))}
      {endPage < totalPages && (
         <>
          {endPage < totalPages -1 && <span className="text-gray-500 dark:text-gray-400 px-1">...</span>}
          <PaginationButton onClick={() => onPageChange(totalPages)} ariaLabel={`Go to page ${totalPages}`}>{totalPages}</PaginationButton>
        </>
      )}
      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        ariaLabel="Go to next page"
      >
        Next
      </PaginationButton>
    </nav>
  );
};

const BrowsePage: React.FC = () => {
  const { isSidebarOpen } = useLayoutContext(); // Consume context
  const [searchParams, setSearchParams] = useSearchParams();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [pageTitle, setPageTitle] = useState('Browse Media');

  const updateFiltersFromParams = useCallback(() => {
    const newFilters: Filters = {};
    const typeParam = searchParams.get('type');
    if (typeParam === 'movie' || typeParam === 'tv') newFilters.type = typeParam;
    if (searchParams.get('genre')) newFilters.genre = searchParams.get('genre')!;
    if (searchParams.get('year')) newFilters.year = parseInt(searchParams.get('year')!);
    if (searchParams.get('rating')) newFilters.rating = parseInt(searchParams.get('rating')!);
    
    const sortParam = searchParams.get('sort');
    if (sortParam === 'top_rated') newFilters.sort = sortParam;
    const minVotesParam = searchParams.get('min_votes');
    if (minVotesParam) newFilters.min_votes = parseInt(minVotesParam);

    const pageParam = parseInt(searchParams.get('page') || '1');
    
    setFilters(newFilters);
    setCurrentPage(pageParam);

    // Update Page Title
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
        setPageTitle(`Search: "${searchQuery}"`);
    } else if (newFilters.sort === 'top_rated') {
        setPageTitle(newFilters.type === 'tv' ? 'Top Rated TV Shows' : 'Top Rated Movies');
    } else if (newFilters.type === 'movie') {
        setPageTitle('Browse Movies');
    } else if (newFilters.type === 'tv') {
        setPageTitle('Browse TV Shows');
    } else {
        setPageTitle('Browse All Media'); // Default when no specific type or sort=top_rated
    }
  }, [searchParams]);


  useEffect(() => {
    updateFiltersFromParams();
  }, [searchParams, updateFiltersFromParams]);
  
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters = {...filters}; 
        const data = await browseMedia(activeFilters, currentPage);
        setMediaItems(data.results);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch media items:', err);
        setError('Could not load items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [filters, currentPage]); 

  const handleFilterChange = (panelFilters: Filters) => {
    const params = new URLSearchParams();
    // Apply panel filters
    if (panelFilters.type) params.set('type', panelFilters.type);
    if (panelFilters.genre) params.set('genre', panelFilters.genre);
    if (panelFilters.year) params.set('year', String(panelFilters.year));
    if (panelFilters.rating) params.set('rating', String(panelFilters.rating));
    
    // Preserve sort and min_votes from current URL if they exist, as panel doesn't control them
    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);
    const currentMinVotes = searchParams.get('min_votes');
    if (currentMinVotes) params.set('min_votes', currentMinVotes);

    // Preserve search query if it exists
    const currentSearchQuery = searchParams.get('search');
    if(currentSearchQuery) params.set('search', currentSearchQuery);
    
    params.set('page', '1'); 
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    document.getElementById('main-content')?.scrollTo(0, 0);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1">{pageTitle}</h1>
      <FilterPanel currentFilters={filters} onFilterChange={handleFilterChange} />
      {isLoading ? (
        <div className="flex justify-center py-10 min-h-[300px] items-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 dark:text-red-400 text-xl py-10">{error}</p>
      ) : mediaItems.length > 0 ? (
        <>
          <MediaGrid items={mediaItems} isSidebarOpen={isSidebarOpen} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 text-xl py-10 min-h-[200px] flex items-center justify-center">No media found matching your criteria.</p>
      )}
    </div>
  );
};

export default BrowsePage;
