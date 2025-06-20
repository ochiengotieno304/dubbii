import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER } from '../constants';
import { useWatchLater } from '../contexts/WatchLaterContext';

interface CarouselProps {
  items: MediaItem[];
  isLoading?: boolean;
  error?: string | null;
  autoplayInterval?: number;
}

const CarouselSlide: React.FC<{ item: MediaItem; isActive: boolean }> = ({ item, isActive }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const isInWatchLater = watchLaterItems.some(media => media.id === item.id && media.type === item.type);

  const handleToggleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchLater) {
      removeFromWatchLater(item.id, item.type);
    } else {
      addToWatchLater(item);
    }
  };

  useEffect(() => {
    // Check if the image is already cached
    const imageUrl = item.backdropPath || DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER;
    const img = new Image();
    img.src = imageUrl;

    if (img.complete) {
      setIsImageLoaded(true);
    } else {
      setIsImageLoaded(false);
    }
  }, [item.backdropPath]);

  return (
    <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      <div className="relative w-full h-full">
        {!isImageLoaded && (
          <div className="absolute inset-0 w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <img src={DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER} alt="Loading backdrop" className="w-full h-full object-cover opacity-30" />
            <LoadingSpinner size="md" color="text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <img
          src={item.backdropPath || DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER}
          alt={`Backdrop for ${item.title}`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_CAROUSEL_IMAGE_PLACEHOLDER; setIsImageLoaded(true); }}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-10 lg:p-16 text-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 line-clamp-2 shadow-black/50" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{item.title}</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-3 sm:mb-4 md:mb-6 line-clamp-2 md:line-clamp-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{item.overview}</p>
          <div className="flex space-x-4">
            <Link
              to={`/media/${item.type}/${item.id}`}
              className="bg-secondary text-gray-900 hover:bg-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black/50 font-bold py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-7 rounded-lg text-xs sm:text-sm md:text-base transition-all duration-300 ease-in-out inline-block shadow-lg hover:shadow-xl active:scale-95 transform flex items-center space-x-2"
            >
              <span>View Details</span>
            </Link>
            <button
              onClick={handleToggleWatchLater}
              title={isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
              aria-label={isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
              aria-pressed={isInWatchLater}
              className={`bg-gray-700/60 hover:bg-gray-900/80 dark:bg-gray-600/70 dark:hover:bg-gray-500/90 text-white focus:ring-2 focus:ring-gray-500 font-bold py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-7 rounded-lg text-xs sm:text-sm md:text-base transition-all duration-300 ease-in-out inline-block shadow-lg hover:shadow-xl active:scale-95 transform flex items-center space-x-2
                ${isInWatchLater ? 'bg-secondary hover:bg-amber-400 text-gray-900 focus:ring-amber-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                {isInWatchLater ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                )}
              </svg>
              <span>{isInWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Carousel: React.FC<CarouselProps> = ({ items, isLoading, error, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    if (!items || items.length === 0) return;
    setCurrentIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  }, [items]);

  const goToNext = useCallback(() => {
    if (!items || items.length === 0) return;
    setCurrentIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items]);

  useEffect(() => {
    if (!items || items.length === 0 || !autoplayInterval || isLoading) return;
    const timer = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(timer);
  }, [goToNext, items, autoplayInterval, isLoading]);

  if (isLoading) {
    return (
      // Adjusted aspect ratio and max height for responsiveness
      <div className="w-full aspect-[16/9] max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] md:aspect-[21/9] lg:aspect-[2.7/1] bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg flex items-center justify-center animate-pulse">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-[16/9] max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] md:aspect-[21/9] lg:aspect-[2.7/1] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl shadow-lg flex items-center justify-center p-4 text-center">
        <p>Error loading featured content: {error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="w-full aspect-[16/9] max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] md:aspect-[21/9] lg:aspect-[2.7/1] bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center p-4">
        <p className="text-gray-600 dark:text-gray-400">No featured content available.</p>
      </div>
    );
  }

  return (
    // Adjusted aspect ratio and max height for responsiveness
    <div className="relative w-full aspect-[16/9] max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] md:aspect-[21/9] lg:aspect-[2.7/1] overflow-hidden rounded-xl shadow-2xl group">
      {items.map((item, index) => (
        <CarouselSlide key={item.id} item={item} isActive={index === currentIndex} />
      ))}

      {/* Reduced size of nav buttons for smaller screens indirectly by keeping padding, but icons are fixed size */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 sm:left-3 md:left-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-white/50 active:scale-90"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 sm:right-3 md:right-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full z-20 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-white/50 active:scale-90"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Adjusted dot indicators size */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-2.5">
        {items.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 transform hover:scale-125
              ${index === currentIndex ? 'bg-secondary scale-125' : 'bg-white/60 hover:bg-white/90'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};