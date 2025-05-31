import { Genre } from './types';

// Note: API_IMAGE_BASE_URL was 'https://image.tmdb.org/t/p/' but is currently unused
// as mock data uses full picsum.photos URLs. If switching to relative paths from TMDB,
// this would be used with size suffixes (e.g., w500, original).

export const GENRES_LIST: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export const YEARS_LIST: number[] = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export const RATINGS_LIST: number[] = Array.from({ length: 10 }, (_, i) => 10 - i);

export const ITEMS_PER_PAGE = 20;

export const DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER = 'https://via.placeholder.com/1280x720/CCCCCC/969696?text=Loading...';
export const DEFAULT_POSTER_PLACEHOLDER = 'https://via.placeholder.com/200x300/CCCCCC/969696?text=N/A';
export const DEFAULT_PROFILE_PLACEHOLDER = 'https://via.placeholder.com/150x225/CCCCCC/969696?text=N/A';
export const DEFAULT_SEARCH_THUMB_PLACEHOLDER = 'https://via.placeholder.com/40x60/CCCCCC/969696?text=N/A';
export const DEFAULT_EPISODE_STILL_PLACEHOLDER = 'https://via.placeholder.com/640x360/CCCCCC/969696?text=No+Still';