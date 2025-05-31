
import React, { useState, useEffect } from 'react';
import { getTrendingMoviesForCarousel, getPopularMoviesFromTMDB, getTrendingTVShows } from '../services/mediaService';
import { MediaItem } from '../types';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Carousel } from '../components/Carousel';
import { useLayoutContext } from '../contexts/LayoutContext'; // Import context hook

const HomePage: React.FC = () => {
  const { isSidebarOpen } = useLayoutContext(); // Consume context
  const [carouselMovies, setCarouselMovies] = useState<MediaItem[]>([]); // For Carousel: Trending Movies of the week
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]); // For Grid: Popular Movies (Data Source for "Now Playing" section title)
  const [trendingTVShows, setTrendingTVShows] = useState<MediaItem[]>([]);
  
  const [isLoadingCarouselMovies, setIsLoadingCarouselMovies] = useState(true);
  const [isLoadingPopularMovies, setIsLoadingPopularMovies] = useState(true);
  const [isLoadingTVShows, setIsLoadingTVShows] = useState(true);
  
  const [errorCarouselMovies, setErrorCarouselMovies] = useState<string | null>(null);
  const [errorPopularMovies, setErrorPopularMovies] = useState<string | null>(null);
  const [errorTVShows, setErrorTVShows] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      // Fetch for Carousel (Trending Movies of the week from TMDB)
      try {
        setIsLoadingCarouselMovies(true);
        setErrorCarouselMovies(null);
        const moviesForCarousel = await getTrendingMoviesForCarousel(); 
        setCarouselMovies(moviesForCarousel);
      } catch (err) {
        console.error('Failed to fetch trending movies for carousel:', err);
        setErrorCarouselMovies('Could not load trending movies for carousel.');
      } finally {
        setIsLoadingCarouselMovies(false);
      }

      // Fetch for "Now Playing" Grid (data from Popular Movies endpoint from TMDB)
      try {
        setIsLoadingPopularMovies(true);
        setErrorPopularMovies(null);
        const moviesForGrid = await getPopularMoviesFromTMDB(); 
        setPopularMovies(moviesForGrid); 
      } catch (err) {
        console.error('Failed to fetch popular movies for grid:', err);
        setErrorPopularMovies('Could not load movies for this section.');
      } finally {
        setIsLoadingPopularMovies(false);
      }

      // Fetch for Trending TV Shows Grid (from TMDB)
      try {
        setIsLoadingTVShows(true);
        setErrorTVShows(null);
        const tvShows = await getTrendingTVShows();
        setTrendingTVShows(tvShows);
      } catch (err) {
        console.error('Failed to fetch trending TV shows:', err);
        setErrorTVShows('Could not load trending TV shows.');
      } finally {
        setIsLoadingTVShows(false);
      }
    };

    fetchAllContent();
  }, []);
  
  const criticalError = (errorCarouselMovies && carouselMovies.length === 0) || 
                        (errorPopularMovies && popularMovies.length === 0 && !isLoadingPopularMovies) || 
                        (errorTVShows && trendingTVShows.length === 0 && !isLoadingTVShows);

  if (criticalError && !isLoadingCarouselMovies && !isLoadingPopularMovies && !isLoadingTVShows) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 text-xl py-10 px-4">
        <p className="font-semibold mb-3 text-2xl">Oops! Something went wrong.</p>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
          We couldn't load the content for the page. This might be due to a network connectivity issue or the TMDB service being temporarily unavailable.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please check your internet connection and try refreshing the page. If the problem persists, the TMDB service might be experiencing difficulties.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-10 md:space-y-16">
      <section aria-labelledby="featured-movies-heading" className="mb-6 md:mb-8">
         <h2 id="featured-movies-heading" className="sr-only">Trending Movies Carousel</h2>
        <Carousel items={carouselMovies} isLoading={isLoadingCarouselMovies} error={errorCarouselMovies} />
      </section>

      <section aria-labelledby="now-playing-movies-heading">
        <h2 id="now-playing-movies-heading" className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1">Now Playing</h2>
        {isLoadingPopularMovies ? <MediaGrid items={[]} isLoading={true} isSidebarOpen={isSidebarOpen} /> : <MediaGrid items={popularMovies} isSidebarOpen={isSidebarOpen} />}
        {!isLoadingPopularMovies && popularMovies.length === 0 && !errorPopularMovies && (
           <p className="text-center text-gray-600 dark:text-gray-400 py-6">No movies available in this section at the moment.</p>
        )}
        {errorPopularMovies && !isLoadingPopularMovies && <p className="text-center text-red-500 dark:text-red-400 mt-4">{errorPopularMovies}</p>}
      </section>

      <section aria-labelledby="trending-tv-shows-heading">
        <h2 id="trending-tv-shows-heading" className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1">Trending TV Shows</h2>
        {isLoadingTVShows ? <MediaGrid items={[]} isLoading={true} isSidebarOpen={isSidebarOpen} /> : <MediaGrid items={trendingTVShows} isSidebarOpen={isSidebarOpen} />}
         {!isLoadingTVShows && trendingTVShows.length === 0 && !errorTVShows && (
           <p className="text-center text-gray-600 dark:text-gray-400 py-6">No trending TV shows available at the moment.</p>
        )}
        {errorTVShows && !isLoadingTVShows && <p className="text-center text-red-500 dark:text-red-400 mt-4">{errorTVShows}</p>}
      </section>
    </div>
  );
};

export default HomePage;
