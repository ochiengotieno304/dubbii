import { MediaItem, MediaDetails, PaginatedResponse, Filters, Genre, CastMember, Review, MediaType, Season, Episode } from '../types';
import { GENRES_LIST, ITEMS_PER_PAGE } from '../constants';

const allGenresMap = new Map(GENRES_LIST.map(g => [g.id, g.name]));

const generateMockEpisodes = (tvShowId: string, seasonNumber: number, numEpisodes: number): Episode[] => {
  const episodes: Episode[] = [];
  for (let i = 1; i <= numEpisodes; i++) {
    episodes.push({
      id: `${tvShowId}-s${seasonNumber}e${i}`,
      seasonNumber,
      episodeNumber: i,
      title: `Episode ${i}: The Adventure Continues`,
      overview: `This is a detailed overview of season ${seasonNumber}, episode ${i}. Exciting things happen, characters develop, and the plot thickens. Viewers will be on the edge of their seats.`,
      airDate: `${2007 + seasonNumber}-${String(i*2).padStart(2, '0')}-01`, // Mock air date
      stillPath: `https://picsum.photos/seed/${tvShowId}_s${seasonNumber}e${i}_still/640/360`,
      voteAverage: Math.round((7 + Math.random() * 2.5) * 10) / 10,
    });
  }
  return episodes;
};

const generateMockSeasons = (tvShowId: string, numSeasons: number): Season[] => {
  const seasons: Season[] = [];
  for (let i = 1; i <= numSeasons; i++) {
    const episodeCount = Math.floor(Math.random() * 6) + 8; // 8-13 episodes
    seasons.push({
      id: `${tvShowId}-s${i}`,
      seasonNumber: i,
      name: `Season ${i}`,
      overview: `Overview for Season ${i} of this amazing show. It explores new themes and challenges for the characters.`,
      posterPath: `https://picsum.photos/seed/${tvShowId}_s${i}_poster/200/300`,
      airDate: `${2007 + i}-01-15`, // Mock air date
      episodeCount: episodeCount,
      episodes: generateMockEpisodes(tvShowId, i, episodeCount),
    });
  }
  return seasons;
};


const mockMovies: MediaDetails[] = [
  {
    id: 'movie1', title: 'Inception', type: 'movie', posterPath: 'https://picsum.photos/seed/inception/200/300', releaseDate: '2010-07-16', voteAverage: 8.8,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 53, name: 'Thriller' }],
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    tagline: 'Your mind is the scene of the crime.', runtime: 148, trailerKey: 'YoHD9XEInc0',
    cast: [
      { id: 1, name: 'Leonardo DiCaprio', character: 'Cobb', profilePath: 'https://picsum.photos/seed/leo/100/150' },
      { id: 2, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: 'https://picsum.photos/seed/jgl/100/150' },
    ],
    reviews: [
      { id: 'r1', author: 'User123', content: 'Amazing movie!', rating: 10, createdAt: '2023-01-15T10:00:00Z' },
      { id: 'r2', author: 'Cinephile_Max', content: 'A mind-bending masterpiece.', rating: 9, createdAt: '2023-01-16T12:30:00Z' },
    ],
    backdropPath: 'https://picsum.photos/seed/inception_backdrop/1280/720',
  },
  {
    id: 'movie2', title: 'The Dark Knight', type: 'movie', posterPath: 'https://picsum.photos/seed/darkknight/200/300', releaseDate: '2008-07-18', voteAverage: 9.0,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    runtime: 152, trailerKey: 'EXeTwQWrcuw',
    cast: [{ id: 3, name: 'Christian Bale', character: 'Bruce Wayne / Batman' }, { id: 4, name: 'Heath Ledger', character: 'Joker' }],
    reviews: [{ id: 'r3', author: 'GothamFan', content: 'Heath Ledger was phenomenal.', rating: 10, createdAt: '2022-11-05T18:20:00Z' }],
    backdropPath: 'https://picsum.photos/seed/darkknight_backdrop/1280/720',
  },
   {
    id: 'movie3', title: 'Pulp Fiction', type: 'movie', posterPath: 'https://picsum.photos/seed/pulpfiction/200/300', releaseDate: '1994-10-14', voteAverage: 8.9,
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    runtime: 154, trailerKey: 's7EdQ4FqbhY',
    cast: [{ id: 5, name: 'John Travolta', character: 'Vincent Vega' }, { id: 6, name: 'Samuel L. Jackson', character: 'Jules Winnfield' }],
    reviews: [{ id: 'r4', author: 'TarantinoFan', content: 'Iconic!', rating: 10, createdAt: '2023-03-10T14:00:00Z'}],
    backdropPath: 'https://picsum.photos/seed/pulpfiction_backdrop/1280/720',
  },
];

const mockTvShows: MediaDetails[] = [
  {
    id: 'tv1', title: 'Breaking Bad', type: 'tv', posterPath: 'https://picsum.photos/seed/breakingbad/200/300', releaseDate: '2008', voteAverage: 9.5,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    numberOfSeasons: 5, trailerKey: 'HhesaQXLuRY',
    cast: [
      { id: 101, name: 'Bryan Cranston', character: 'Walter White', profilePath: 'https://picsum.photos/seed/bryan/100/150' },
      { id: 102, name: 'Aaron Paul', character: 'Jesse Pinkman', profilePath: 'https://picsum.photos/seed/aaron/100/150' },
    ],
    reviews: [
      { id: 'rtv1', author: 'TV_Guru', content: 'One of the best shows ever.', rating: 10, createdAt: '2023-02-20T09:15:00Z' },
    ],
    backdropPath: 'https://picsum.photos/seed/breakingbad_backdrop/1280/720',
    seasons: generateMockSeasons('tv1', 5),
  },
  {
    id: 'tv2', title: 'Game of Thrones', type: 'tv', posterPath: 'https://picsum.photos/seed/got/200/300', releaseDate: '2011', voteAverage: 8.4,
    genres: [{ id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi & Fantasy' }],
    overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    numberOfSeasons: 8, trailerKey: 'KPLWWIOCOOQ',
    cast: [{ id: 103, name: 'Emilia Clarke', character: 'Daenerys Targaryen' }, { id: 104, name: 'Kit Harington', character: 'Jon Snow' }],
    reviews: [{ id: 'rtv2', author: 'WesterosWatcher', content: 'Epic scale, complex characters.', rating: 9, createdAt: '2023-04-01T11:00:00Z'}],
    backdropPath: 'https://picsum.photos/seed/got_backdrop/1280/720',
    seasons: generateMockSeasons('tv2', 8),
  },
  {
    id: 'tv3', title: 'Stranger Things', type: 'tv', posterPath: 'https://picsum.photos/seed/strangerthings/200/300', releaseDate: '2016', voteAverage: 8.6,
    genres: [{ id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' }],
    overview: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    numberOfSeasons: 4, trailerKey: 'b9EkMc79ZSU',
    cast: [{ id: 105, name: 'Millie Bobby Brown', character: 'Eleven' }, { id: 106, name: 'Finn Wolfhard', character: 'Mike Wheeler' }],
    reviews: [{ id: 'rtv3', author: 'UpsideDownFan', content: 'Love the 80s vibe!', rating: 9, createdAt: '2023-05-12T16:45:00Z'}],
    backdropPath: 'https://picsum.photos/seed/strangerthings_backdrop/1280/720',
    seasons: generateMockSeasons('tv3', 4),
  },
];

// Add a few more items to make pagination more visible and provide data for "Similar Movies"
for(let i=4; i <= 25; i++) {
    mockMovies.push({
        id: `movie${i}`, title: `Epic Movie Adventure ${i}`, type: 'movie', posterPath: `https://picsum.photos/seed/movie${i}/200/300`, releaseDate: `${2024-i%10}-0${(i%9)+1}-01`, voteAverage: Math.max(5, Math.round((7.0 + (i%10)/5 - Math.random())*10)/10),
        genres: [GENRES_LIST[i % GENRES_LIST.length], GENRES_LIST[(i+3) % GENRES_LIST.length]],
        overview: `This is the overview for Epic Movie Adventure ${i}, a thrilling journey into the unknown. Filled with action, suspense, and unforgettable characters.`,
        runtime: 110 + i%30, trailerKey: 'dQw4w9WgXcQ', cast: [], reviews: [], backdropPath: `https://picsum.photos/seed/movie${i}_backdrop/1280/720`
    });
    const numSeasonsForTv = (i % 4) + 2; // 2-5 seasons
    mockTvShows.push({
        id: `tv${i}`, title: `Amazing TV Series ${i}`, type: 'tv', posterPath: `https://picsum.photos/seed/tv${i}/200/300`, releaseDate: `${2023-i%7}`, voteAverage: Math.max(6, Math.round((7.5 + (i%10)/5 - Math.random())*10)/10),
        genres: [GENRES_LIST[(i+1) % GENRES_LIST.length], GENRES_LIST[(i+2) % GENRES_LIST.length]],
        overview: `This is the overview for Amazing TV Series ${i}, full of drama, excitement, and unexpected twists. Each season builds upon the last, drawing viewers deeper into its world.`,
        numberOfSeasons: numSeasonsForTv, trailerKey: 'dQw4w9WgXcQ', cast: [], reviews: [], backdropPath: `https://picsum.photos/seed/tv${i}_backdrop/1280/720`,
        seasons: generateMockSeasons(`tv${i}`, numSeasonsForTv),
    });
}

let allMedia: MediaDetails[] = [...mockMovies, ...mockTvShows];
// Shuffle allMedia to make trending/browse different initially
for (let i = allMedia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allMedia[i], allMedia[j]] = [allMedia[j], allMedia[i]];
}


const simulateApiCall = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
};

// Helper function to convert MediaDetails to MediaItem, retaining backdropPath
const toMediaItem = (details: MediaDetails): MediaItem => {
  const { 
    cast, 
    reviews, 
    tagline, 
    runtime, 
    numberOfSeasons, 
    trailerKey,
    seasons, // Destructure seasons so it's not in MediaItem
    ...item 
  } = details;
  return item; // This is MediaItem
};


export const getTrendingMovies = async (): Promise<MediaItem[]> => {
  const trending = [...mockMovies] // Create a copy before sorting
    .sort((a, b) => b.voteAverage - a.voteAverage)
    .slice(0, 10);
  return simulateApiCall(trending.map(toMediaItem));
};

export const getTrendingTVShows = async (): Promise<MediaItem[]> => {
  const trending = [...mockTvShows] // Create a copy before sorting
    .sort((a, b) => b.voteAverage - a.voteAverage)
    .slice(0, 10); // Increased to 10
  return simulateApiCall(trending.map(toMediaItem));
};

export const searchMedia = async (query: string): Promise<MediaItem[]> => {
  if (!query.trim()) return simulateApiCall([]);
  const lowerQuery = query.toLowerCase();
  const results = allMedia
    .filter(item => item.title.toLowerCase().includes(lowerQuery))
    .slice(0, 10) 
    .map(toMediaItem);
  return simulateApiCall(results);
};

export const getMediaDetails = async (id: string, type: MediaType): Promise<MediaDetails | null> => {
  const item = allMedia.find(m => m.id === id && m.type === type);
  return simulateApiCall(item || null);
};

export const getSimilarMedia = async (id: string, type: MediaType): Promise<MediaItem[]> => {
  // Simulate fetching similar media. Exclude the current item.
  // For movies, grab other movies. For TV, grab other TV shows.
  const sourceArray = type === 'movie' ? mockMovies : mockTvShows;
  const similar = sourceArray
    .filter(item => item.id !== id) // Exclude the current item itself
    .sort(() => 0.5 - Math.random()) // Randomize
    .slice(0, 5) // Take 5 similar items
    .map(toMediaItem);
  return simulateApiCall(similar, 700); // Slightly longer delay
};

export const browseMedia = async (
  filters: Filters,
  page: number = 1,
  limit: number = ITEMS_PER_PAGE
): Promise<PaginatedResponse<MediaItem>> => {
  let filteredItems = [...allMedia];

  if (filters.type) {
    filteredItems = filteredItems.filter(item => item.type === filters.type);
  }
  if (filters.genre) {
    const genreId = GENRES_LIST.find(g => g.name === filters.genre)?.id;
    if (genreId) {
      filteredItems = filteredItems.filter(item => item.genres.some(g => g.id === genreId));
    }
  }
  if (filters.year) {
    filteredItems = filteredItems.filter(item => parseInt(item.releaseDate.substring(0, 4)) === filters.year);
  }
  if (filters.rating) {
    filteredItems = filteredItems.filter(item => Math.floor(item.voteAverage) >= filters.rating!);
  }

  const totalResults = filteredItems.length;
  const totalPages = Math.ceil(totalResults / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filteredItems
    .slice(startIndex, endIndex)
    .map(toMediaItem);

  return simulateApiCall({
    page,
    results: paginatedResults,
    totalPages,
    totalResults,
  });
};
