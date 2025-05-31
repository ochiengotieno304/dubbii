import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem, Genre } from '../types';
import RatingStars from './RatingStars';
import { DEFAULT_POSTER_PLACEHOLDER } from '../constants';

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const year = media.releaseDate ? new Date(media.releaseDate).getFullYear() : 'N/A';
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false); // Reset on media change
  }, [media.id]);

  return (
    <Link 
      to={`/media/${media.type}/${media.id}`} 
      className="group bg-primary dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-base-100 transition-all duration-300 ease-in-out flex flex-col h-full"
      aria-label={`View details for ${media.title}`}
    >
      <div className="relative w-full aspect-[2/3]">
        {/* Placeholder */}
        {!isImageLoaded && (
          <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center rounded-t-xl">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
        <img 
          src={media.posterPath || DEFAULT_POSTER_PLACEHOLDER} 
          alt={media.title || 'Media poster'} 
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER_PLACEHOLDER; setIsImageLoaded(true); }}
          className={`w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500 ease-in-out rounded-t-xl ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-2.5 right-2.5 bg-secondary text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {media.type === 'movie' ? 'Movie' : 'TV Show'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-neutral dark:text-gray-100 mb-1 truncate group-hover:text-secondary transition-colors duration-300" title={media.title}>
          {media.title}
        </h3>
        <div className="flex items-center mb-1.5">
          <RatingStars rating={media.voteAverage} maxRating={10} />
          <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">{media.voteAverage.toFixed(1)}/10</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Released: {year}</p>
        <div className="mb-2.5 min-h-[2rem]"> {/* Consistent height for genre tags */}
          {media.genres.slice(0, 2).map((genre: Genre) => (
            <span key={genre.id} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[0.7rem] px-2 py-0.5 rounded-full mr-1 mb-1 font-medium">
              {genre.name}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">{media.overview}</p>
      </div>
    </Link>
  );
};

export default MediaCard;