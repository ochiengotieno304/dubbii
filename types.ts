export interface Genre {
  id: number;
  name: string;
}

export type MediaType = 'movie' | 'tv';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  airDate: string; // YYYY-MM-DD
  stillPath?: string; // Image for the episode
  voteAverage?: number; // 0-10
}

export interface Season {
  id: string;
  seasonNumber: number;
  name: string; // e.g., "Season 1"
  overview?: string;
  posterPath?: string;
  airDate?: string; // YYYY-MM-DD (typically the first episode's air date)
  episodeCount: number;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  posterPath: string;
  releaseDate: string; // YYYY-MM-DD or YYYY for TV shows
  voteAverage: number; // 0-10
  genres: Genre[];
  overview: string;
  backdropPath?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  rating?: number; 
  createdAt: string; // ISO date string
}

export interface MediaDetails extends MediaItem {
  tagline?: string;
  runtime?: number; // minutes (for movies)
  numberOfSeasons?: number; // for TV (can be derived from seasons.length or kept for top-level info)
  trailerKey?: string; // YouTube video key
  cast: CastMember[];
  reviews: Review[];
  seasons?: Season[]; // For TV shows
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export interface Filters {
  genre?: string;
  year?: number;
  rating?: number;
  type?: MediaType;
  sort?: 'popularity.desc' | 'release_date.desc' | 'vote_average.desc' | 'top_rated'; // Added 'top_rated'
  min_votes?: number; // Added for minimum vote count
}