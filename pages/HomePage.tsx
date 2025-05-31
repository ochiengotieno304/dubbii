import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getTrendingTVShows } from '../services/mediaService';
import { MediaItem } from '../types';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Carousel } from '../components/Carousel'; // Import Carousel

const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<MediaItem[]>([]);
  
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingTVShows, setIsLoadingTVShows] = useState(true);
  
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  const [errorTVShows, setErrorTVShows] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTrending = async () => {
      // Fetch for Carousel (Featured Movies)
      try {
        setIsLoadingFeatured(true);
        const moviesForCarousel = await getTrendingMovies(); 
        setFeaturedMovies(moviesForCarousel);
      } catch (err) {
        console.error('Failed to fetch featured movies for carousel:', err);
        setErrorFeatured('Could not load featured content.');
      } finally {
        setIsLoadingFeatured(false);
      }

      // Fetch for Popular Movies Grid
      try {
        setIsLoadingPopular(true);
        const moviesForGrid = await getTrendingMovies(); 
        setPopularMovies(moviesForGrid.slice(0,10)); // Show more popular movies
      } catch (err) {
        console.error('Failed to fetch popular movies:', err);
        setErrorPopular('Could not load popular movies.');
      } finally {
        setIsLoadingPopular(false);
      }

      // Fetch for Trending TV Shows Grid
      try {
        setIsLoadingTVShows(true);
        const tvShows = await getTrendingTVShows();
        setTrendingTVShows(tvShows.slice(0,10)); // Show more trending TV shows
      } catch (err) {
        console.error('Failed to fetch trending TV shows:', err);
        setErrorTVShows('Could not load trending TV shows.');
      } finally {
        setIsLoadingTVShows(false);
      }
    };

    fetchAllTrending();
  }, []);
  
  const criticalError = (errorFeatured && featuredMovies.length === 0) || 
                        (errorPopular && popularMovies.length === 0 && !isLoadingPopular) || 
                        (errorTVShows && trendingTVShows.length === 0 && !isLoadingTVShows);

  if (criticalError) {
    return <p className="text-center text-red-500 dark:text-red-400 text-xl py-10">Failed to load page content. Please try again later.</p>;
  }
  
  return (
    <div className="space-y-10 md:space-y-16">
      <section aria-labelledby="featured-movies-heading" className="mb-6 md:mb-8"> {/* Added bottom margin */}
         <h2 id="featured-movies-heading" className="sr-only">Featured Movies Carousel</h2>
        <Carousel items={featuredMovies} isLoading={isLoadingFeatured} error={errorFeatured} />
      </section>

      <section aria-labelledby="popular-movies-heading">
        <h2 id="popular-movies-heading" className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1">Popular Movies</h2>
        {isLoadingPopular ? <MediaGrid items={[]} isLoading={true} /> : <MediaGrid items={popularMovies} />}
        {!isLoadingPopular && popularMovies.length === 0 && !errorPopular && (
           <p className="text-center text-gray-600 dark:text-gray-400 py-6">No popular movies available at the moment.</p>
        )}
        {errorPopular && <p className="text-center text-red-500 dark:text-red-400 mt-4">{errorPopular}</p>}
      </section>

      <section aria-labelledby="trending-tv-shows-heading">
        <h2 id="trending-tv-shows-heading" className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1">Trending TV Shows</h2>
        {isLoadingTVShows ? <MediaGrid items={[]} isLoading={true} /> : <MediaGrid items={trendingTVShows} />}
         {!isLoadingTVShows && trendingTVShows.length === 0 && !errorTVShows && (
           <p className="text-center text-gray-600 dark:text-gray-400 py-6">No trending TV shows available at the moment.</p>
        )}
        {errorTVShows && <p className="text-center text-red-500 dark:text-red-400 mt-4">{errorTVShows}</p>}
      </section>
    </div>
  );
};

export default HomePage;