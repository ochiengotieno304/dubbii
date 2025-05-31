import { MediaItem, MediaDetails, PaginatedResponse, Filters, Genre, MediaType, Season, Episode } from '../types';
import { GENRES_LIST, ITEMS_PER_PAGE, TMDB_API_BASE_URL, TMDB_IMAGE_BASE_URL } from '../constants';

// Access the API key from Vite's environment variables
const TMDB_API_KEY = (import.meta as any).env.VITE_TMDB_API_KEY;

const allGenresMap = new Map(GENRES_LIST.map(g => [g.id, g.name]));

// --- TMDB API Helper Functions ---

const fetchTMDB = async (endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<any> => {
  if (!TMDB_API_KEY) {
    console.error('VITE_TMDB_API_KEY is not set. TMDB API calls will fail. Ensure it is set in your .env file for local development or in your deployment environment variables.');
    throw new Error('TMDB API Key is not configured.');
  }
  const urlParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
  });
  const url = `${TMDB_API_BASE_URL}/${endpoint}?${urlParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`TMDB API Error (${response.status}) for ${url}:`, errorData.status_message || response.statusText);
      throw new Error(errorData.status_message || `TMDB API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Network or other error fetching from TMDB ${url}:`, error);
    throw error;
  }
};

const tmdbMovieToMediaItem = (movie: any): MediaItem => {
  return {
    id: String(movie.id),
    title: movie.title || movie.name || 'Untitled',
    type: 'movie',
    posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}w500${movie.poster_path}` : '',
    releaseDate: movie.release_date || '',
    voteAverage: movie.vote_average || 0,
    genres: movie.genre_ids ? movie.genre_ids.map((id: number) => ({ id, name: allGenresMap.get(id) || 'Unknown' })).filter((g: Genre) => g.name !== 'Unknown') as Genre[] : [],
    overview: movie.overview || '',
    backdropPath: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}` : undefined,
  };
};

const tmdbTVToMediaItem = (tvShow: any): MediaItem => {
  return {
    id: String(tvShow.id),
    title: tvShow.name || 'Untitled',
    type: 'tv',
    posterPath: tvShow.poster_path ? `${TMDB_IMAGE_BASE_URL}w500${tvShow.poster_path}` : '',
    releaseDate: tvShow.first_air_date || '',
    voteAverage: tvShow.vote_average || 0,
    genres: tvShow.genre_ids ? tvShow.genre_ids.map((id: number) => ({ id, name: allGenresMap.get(id) || 'Unknown' })).filter((g: Genre) => g.name !== 'Unknown') as Genre[] : [],
    overview: tvShow.overview || '',
    backdropPath: tvShow.backdrop_path ? `${TMDB_IMAGE_BASE_URL}original${tvShow.backdrop_path}` : undefined,
  };
};


const tmdbMovieToMediaDetails = (movie: any): MediaDetails => {
  const baseItem = tmdbMovieToMediaItem(movie) as MediaDetails;
  baseItem.tagline = movie.tagline;
  baseItem.runtime = movie.runtime;
  baseItem.trailerKey = movie.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key;
  baseItem.cast = movie.credits?.cast?.slice(0, 20).map((c: any) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profilePath: c.profile_path ? `${TMDB_IMAGE_BASE_URL}w185${c.profile_path}` : undefined,
  })) || [];
  baseItem.reviews = movie.reviews?.results?.map((r: any) => ({
    id: r.id,
    author: r.author,
    content: r.content,
    rating: r.author_details?.rating,
    createdAt: r.created_at,
  })) || [];
  baseItem.genres = movie.genres?.map((g: any) => ({ id: g.id, name: g.name })) || baseItem.genres;
  return baseItem;
};

const tmdbEpisodeToAppEpisode = (episode: any): Episode => {
  return {
    id: String(episode.id),
    seasonNumber: episode.season_number,
    episodeNumber: episode.episode_number,
    title: episode.name || `Episode ${episode.episode_number}`,
    overview: episode.overview || 'No overview available.',
    airDate: episode.air_date || '',
    stillPath: episode.still_path ? `${TMDB_IMAGE_BASE_URL}w780${episode.still_path}` : undefined,
    voteAverage: episode.vote_average || 0,
  };
};

const tmdbTVToMediaDetails = async (tvShow: any): Promise<MediaDetails> => {
  const baseItem = tmdbTVToMediaItem(tvShow) as MediaDetails;
  baseItem.tagline = tvShow.tagline;
  baseItem.numberOfSeasons = tvShow.number_of_seasons;
  baseItem.trailerKey = tvShow.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key;
  baseItem.cast = tvShow.credits?.cast?.slice(0, 20).map((c: any) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profilePath: c.profile_path ? `${TMDB_IMAGE_BASE_URL}w185${c.profile_path}` : undefined,
  })) || [];
  baseItem.reviews = tvShow.reviews?.results?.map((r: any) => ({
    id: r.id,
    author: r.author,
    content: r.content,
    rating: r.author_details?.rating,
    createdAt: r.created_at,
  })) || [];
  baseItem.genres = tvShow.genres?.map((g: any) => ({ id: g.id, name: g.name })) || baseItem.genres;

  const seasons: Season[] = [];
  if (tvShow.seasons) {
    for (const s of tvShow.seasons) {
      let episodes: Episode[] = [];
      // Fetch episodes for this season if it's not a "Specials" season (season_number > 0)
      // and TMDB_API_KEY is available
      if (s.season_number > 0 && TMDB_API_KEY) {
        try {
          const seasonDetail = await fetchTMDB(`tv/${tvShow.id}/season/${s.season_number}`, { language: 'en-US' });
          if (seasonDetail && seasonDetail.episodes) {
            episodes = seasonDetail.episodes.map(tmdbEpisodeToAppEpisode);
          }
        } catch (error) {
          console.error(`Failed to fetch episodes for ${baseItem.title} Season ${s.season_number}:`, error);
          // Keep episodes array empty or add a placeholder if needed
        }
      }
      seasons.push({
        id: String(s.id), // Use TMDB season ID for keying if needed
        seasonNumber: s.season_number,
        name: s.name || `Season ${s.season_number}`,
        overview: s.overview,
        posterPath: s.poster_path ? `${TMDB_IMAGE_BASE_URL}w500${s.poster_path}` : undefined,
        airDate: s.air_date,
        episodeCount: s.episode_count || episodes.length, // Use actual episode count if available
        episodes: episodes,
      });
    }
  }
  baseItem.seasons = seasons;
  return baseItem;
};


// --- Mock Data ---
const generateMockEpisodes = (tvShowId: string, seasonNumber: number, numEpisodes: number): Episode[] => {
  const episodes: Episode[] = [];
  for (let i = 1; i <= numEpisodes; i++) {
    episodes.push({
      id: `${tvShowId}-s${seasonNumber}e${i}`,
      seasonNumber,
      episodeNumber: i,
      title: `Episode ${i}: The Adventure Continues`,
      overview: `This is a detailed overview of season ${seasonNumber}, episode ${i}. Exciting things happen, characters develop, and the plot thickens. Viewers will be on the edge of their seats.`,
      airDate: `${2007 + seasonNumber}-${String(i * 2).padStart(2, '0')}-01`,
      stillPath: `https://picsum.photos/seed/${tvShowId}_s${seasonNumber}e${i}_still/640/360`,
      voteAverage: Math.round((7 + Math.random() * 2.5) * 10) / 10,
    });
  }
  return episodes;
};

const generateMockSeasons = (tvShowId: string, numSeasons: number): Season[] => {
  const seasons: Season[] = [];
  for (let i = 1; i <= numSeasons; i++) {
    const episodeCount = Math.floor(Math.random() * 6) + 8;
    seasons.push({
      id: `${tvShowId}-s${i}`,
      seasonNumber: i,
      name: `Season ${i}`,
      overview: `Overview for Season ${i} of this amazing show. It explores new themes and challenges for the characters.`,
      posterPath: `https://picsum.photos/seed/${tvShowId}_s${i}_poster/200/300`,
      airDate: `${2007 + i}-01-15`,
      episodeCount: episodeCount,
      episodes: generateMockEpisodes(tvShowId, i, episodeCount),
    });
  }
  return seasons;
};

const mockMovies: MediaDetails[] = [
  {
    id: 'mockmovie1', title: 'Mock Inception', type: 'movie', posterPath: 'https://picsum.photos/seed/inception_mock/200/300', releaseDate: '2010-07-16', voteAverage: 8.8,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }], overview: 'Mock overview for Inception.',
    cast: [], reviews: [], backdropPath: 'https://picsum.photos/seed/inception_mock_backdrop/1280/720'
  },
  {
    id: 'mockmovie2', title: 'The Great Mock Adventure', type: 'movie', posterPath: 'https://picsum.photos/seed/adventure_mock/200/300', releaseDate: '2015-03-22', voteAverage: 7.5,
    genres: [{ id: 12, name: 'Adventure' }, { id: 10751, name: 'Family' }], overview: 'An epic mock journey to save a fantasy land.',
    cast: [], reviews: [], backdropPath: 'https://picsum.photos/seed/adventure_mock_backdrop/1280/720'
  },
];

const mockTvShows: MediaDetails[] = [
  {
    id: 'tv1', title: 'Breaking Bad (Mock)', type: 'tv', posterPath: 'https://picsum.photos/seed/breakingbad/200/300', releaseDate: '2008', voteAverage: 9.5,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    numberOfSeasons: 5, trailerKey: 'HhesaQXLuRY',
    cast: [{ id: 101, name: 'Bryan Cranston', character: 'Walter White', profilePath: 'https://picsum.photos/seed/bryan/100/150' }, { id: 102, name: 'Aaron Paul', character: 'Jesse Pinkman', profilePath: 'https://picsum.photos/seed/aaron/100/150' }],
    reviews: [{ id: 'rtv1', author: 'TV_Guru', content: 'One of the best shows ever.', rating: 10, createdAt: '2023-02-20T09:15:00Z' }],
    backdropPath: 'https://picsum.photos/seed/breakingbad_backdrop/1280/720',
    seasons: generateMockSeasons('tv1', 5),
  },
  {
    id: 'tv2', title: 'Game of Thrones (Mock)', type: 'tv', posterPath: 'https://picsum.photos/seed/got/200/300', releaseDate: '2011', voteAverage: 8.4,
    genres: [{ id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }, { id: 10765, name: 'Sci-Fi & Fantasy' }],
    overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    numberOfSeasons: 8, trailerKey: 'KPLWWIOCOOQ', cast: [], reviews: [],
    backdropPath: 'https://picsum.photos/seed/got_backdrop/1280/720',
    seasons: generateMockSeasons('tv2', 8),
  },
];
let allMockMedia: MediaDetails[] = [...mockMovies, ...mockTvShows];

const simulateApiCall = <T,>(data: T, delay: number = 50): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
};

const toMediaItemFromDetails = (details: MediaDetails): MediaItem => {
  const { cast, reviews, tagline, runtime, numberOfSeasons, trailerKey, seasons, ...item } = details;
  return item;
};

// --- Service Functions ---

export const getTrendingMoviesForCarousel = async (page: number = 1): Promise<MediaItem[]> => {
  if (!TMDB_API_KEY) {
    console.error('Error fetching trending movies for carousel: TMDB API Key (VITE_TMDB_API_KEY) not configured.');
    return [];
  }
  try {
    const data = await fetchTMDB('trending/movie/week', { page, language: 'en-US' });
    return data.results.map(tmdbMovieToMediaItem).slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending movies for carousel from TMDB:', error);
    return [];
  }
};

export const getPopularMoviesFromTMDB = async (page: number = 1): Promise<MediaItem[]> => {
  if (!TMDB_API_KEY) {
    console.error('Error fetching popular movies: TMDB API Key (VITE_TMDB_API_KEY) not configured.');
    return [];
  }
  try {
    const data = await fetchTMDB('movie/popular', { page, language: 'en-US' });
    return data.results.map(tmdbMovieToMediaItem).slice(0, 10);
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error);
    return [];
  }
};


export const getTrendingTVShows = async (page: number = 1): Promise<MediaItem[]> => {
  if (!TMDB_API_KEY) {
    console.error('Error fetching trending TV shows: TMDB API Key (VITE_TMDB_API_KEY) not configured.');
    return [];
  }
  try {
    const data = await fetchTMDB('trending/tv/day', { page, language: 'en-US' });
    return data.results.map(tmdbTVToMediaItem).slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending TV shows from TMDB:', error);
    return [];
  }
};

export const searchMedia = async (query: string, page: number = 1): Promise<PaginatedResponse<MediaItem>> => {
  if (!query.trim()) return { page: 1, results: [], totalPages: 0, totalResults: 0 };

  if (TMDB_API_KEY) {
    try {
      // First, search for movies
      const movieData = await fetchTMDB('search/movie', { query, page, language: 'en-US', include_adult: false });
      const movieResults = movieData.results.map(tmdbMovieToMediaItem);

      // Then, search for TV shows
      const tvData = await fetchTMDB('search/tv', { query, page, language: 'en-US', include_adult: false });
      const tvResults = tvData.results.map(tmdbTVToMediaItem);

      // Combine the results
      let combinedResults: MediaItem[] = [];
      let movieIndex = 0;
      let tvIndex = 0;

      // Mix movies and tv shows, prioritizing tv shows at the top
      while (tvIndex < tvResults.length || movieIndex < movieResults.length) {
        if (tvIndex < tvResults.length) {
          combinedResults.push(tvResults[tvIndex]);
          tvIndex++;
        }
        if (movieIndex < movieResults.length) {
          combinedResults.push(movieResults[movieIndex]);
          movieIndex++;
        }
      }

      // Calculate total results and pages (approximate, as TMDB returns separate counts)
      const totalResults = movieData.total_results + tvData.total_results;
      const totalPages = Math.min(Math.ceil(totalResults / ITEMS_PER_PAGE), 500);

      return {
        page: movieData.page, // Or tvData.page, as they should be the same
        results: combinedResults,
        totalPages: totalPages,
        totalResults: totalResults,
      };
    } catch (error) {
      console.error('Error searching TMDB:', error);
      // Fall through to mock data if TMDB search fails but key was present
    }
  } else {
    console.warn('TMDB API Key (VITE_TMDB_API_KEY) not configured. Search will use mock data if available.');
  }

  // Fallback to mock data (or if TMDB failed)
  const lowerQuery = query.toLowerCase();
  const mockResults = allMockMedia
    .filter(item => item.title.toLowerCase().includes(lowerQuery))
    .map(toMediaItemFromDetails);

  const totalResults = mockResults.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const paginatedResults = mockResults.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return simulateApiCall({ page, results: paginatedResults, totalPages, totalResults });
};


export const getMediaDetails = async (id: string, type: MediaType): Promise<MediaDetails | null> => {
  if (TMDB_API_KEY) {
    try {
      const endpoint = type === 'movie' ? `movie/${id}` : `tv/${id}`;
      const data = await fetchTMDB(endpoint, { append_to_response: 'videos,credits,reviews', language: 'en-US' });

      if (type === 'movie') {
        return tmdbMovieToMediaDetails(data);
      } else {
        return await tmdbTVToMediaDetails(data); // This is now async
      }
    } catch (error) {
      console.error(`Error fetching ${type} details for ${id} from TMDB:`, error);
      // Fall through to mock data if TMDB fetch fails but key was present
    }
  } else {
    console.warn(`TMDB API Key (VITE_TMDB_API_KEY) not configured. Fetching ${type} details for ${id} using mock data if available.`);
  }

  // Fallback to mock data
  let item = allMockMedia.find(m => m.id === id && m.type === type);
  if (item) {
    if (type === 'tv') {
      if (!item.seasons || item.seasons.length === 0) {
        item.seasons = generateMockSeasons(item.id, item.numberOfSeasons || Math.floor(Math.random() * 3) + 1);
      }
      item.seasons.forEach(s => {
        if (!s.episodes || s.episodes.length === 0) {
          s.episodes = generateMockEpisodes(item.id, s.seasonNumber, s.episodeCount || Math.floor(Math.random() * 5) + 8);
        }
      });
    }
    return simulateApiCall(item);
  }
  return simulateApiCall(null);
};

export const getSimilarMedia = async (id: string, type: MediaType): Promise<MediaItem[]> => {
  if (TMDB_API_KEY) {
    try {
      const endpoint = type === 'movie' ? `movie/${id}/similar` : `tv/${id}/similar`;
      const data = await fetchTMDB(endpoint, { language: 'en-US' });
      const transformer = type === 'movie' ? tmdbMovieToMediaItem : tmdbTVToMediaItem;
      return data.results.slice(0, 5).map(transformer);
    } catch (error) {
      console.error(`Error fetching similar ${type}s for ${id} from TMDB:`, error);
      // Fall through to mock data if TMDB fetch fails but key was present
    }
  } else {
    console.warn(`TMDB API Key (VITE_TMDB_API_KEY) not configured. Fetching similar ${type}s for ${id} using mock data if available.`);
  }

  // Fallback to mock data
  const sourceArray = type === 'movie' ? mockMovies : mockTvShows;
  const similar = sourceArray
    .filter(item => item.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(toMediaItemFromDetails);
  return simulateApiCall(similar, 300);
};

export const browseMedia = async (
  filters: Filters,
  page: number = 1,
): Promise<PaginatedResponse<MediaItem>> => {

  if (TMDB_API_KEY) {
    try {
      let endpoint = '';
      let transformer: (item: any) => MediaItem;
      const params: Record<string, string | number | boolean> = {
        page,
        language: 'en-US',
        include_adult: false
      };

      if (filters.type === 'movie' || filters.type === undefined) {
        endpoint = 'discover/movie';
        transformer = tmdbMovieToMediaItem;
        if (filters.year) params.primary_release_year = filters.year;
      } else {
        endpoint = 'discover/tv';
        transformer = tmdbTVToMediaItem;
        if (filters.year) params.first_air_date_year = filters.year;
      }

      if (filters.genre) {
        const genreId = GENRES_LIST.find(g => g.name === filters.genre)?.id;
        if (genreId) params.with_genres = genreId;
      }
      if (filters.rating) params['vote_average.gte'] = filters.rating;

      if (filters.sort === 'top_rated') {
        params.sort_by = 'vote_average.desc';
        params['vote_count.gte'] = filters.min_votes || 300;
      } else if (filters.sort) {
        params.sort_by = filters.sort;
      }

      const data = await fetchTMDB(endpoint, params);
      return {
        page: data.page,
        results: data.results.map(transformer),
        totalPages: Math.min(data.total_pages, 500),
        totalResults: data.total_results,
      };
    } catch (error) {
      console.error(`Error browsing TMDB ${filters.type || 'media'}:`, error);
      // Fall through to mock data if TMDB fetch fails but key was present
    }
  }

  console.warn('TMDB API Key (VITE_TMDB_API_KEY) not configured or TMDB fetch failed. Falling back to mock data for browse.');
  let sourceMedia = [...allMockMedia];

  if (filters.type) {
    sourceMedia = sourceMedia.filter(item => item.type === filters.type);
  }

  if (filters.genre) {
    const genreId = GENRES_LIST.find(g => g.name === filters.genre)?.id;
    if (genreId) {
      sourceMedia = sourceMedia.filter(item => item.genres.some(g => g.id === genreId));
    }
  }
  if (filters.year) {
    sourceMedia = sourceMedia.filter(item => parseInt(item.releaseDate.substring(0, 4)) === filters.year);
  }
  if (filters.rating) {
    sourceMedia = sourceMedia.filter(item => Math.floor(item.voteAverage) >= filters.rating!);
  }

  if (filters.sort === 'top_rated') {
    sourceMedia.sort((a, b) => {
      const bVotes = (b.voteAverage || 0) > 0 ? 1000 : 0; // Mock vote count for sorting
      const aVotes = (a.voteAverage || 0) > 0 ? 1000 : 0;
      if (filters.min_votes && (aVotes < filters.min_votes || bVotes < filters.min_votes)) {
        if (aVotes < filters.min_votes && bVotes >= filters.min_votes) return 1;
        if (bVotes < filters.min_votes && aVotes >= filters.min_votes) return -1;
      }
      return (b.voteAverage || 0) - (a.voteAverage || 0);
    });
  } else { // Default sort (e.g., by release date or popularity - mock is by release date)
    sourceMedia.sort((a, b) => {
      if (a.releaseDate < b.releaseDate) return 1;
      if (a.releaseDate > b.releaseDate) return -1;
      return a.title.localeCompare(b.title);
    });
  }

  const totalResults = sourceMedia.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResults = sourceMedia
    .slice(startIndex, endIndex)
    .map(toMediaItemFromDetails);

  return simulateApiCall({
    page,
    results: paginatedResults,
    totalPages,
    totalResults,
  });
};