import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { DEFAULT_POSTER_PLACEHOLDER } from '../constants';
import { useWatchLater } from '../contexts/WatchLaterContext';

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const isInWatchLater = watchLaterItems.some(item => item.id === media.id && item.type === media.type);

  const handleToggleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchLater) {
      removeFromWatchLater(media.id, media.type);
    } else {
      addToWatchLater(media);
    }
  };

  return (
    <div className="group bg-primary dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transform hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-base-100 transition-all duration-300 ease-in-out flex flex-col h-full relative">
      <Link
        to={`/media/${media.type}/${media.id}`}
        className="flex flex-col h-full"
        aria-label={`View details for ${media.title}`}
      >
        <div className="relative w-full aspect-[2/3]">
          <img
            src={media.posterPath || DEFAULT_POSTER_PLACEHOLDER}
            alt={media.title || 'Media poster'}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500 ease-in-out rounded-t-xl"
          />
          <div className="absolute top-2.5 left-2.5 bg-secondary text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {media.type === 'movie' ? 'Movie' : 'TV Show'}
          </div>
          <div className="absolute bottom-2 right-2 bg-secondary text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {media.voteAverage.toFixed(1)}/10
          </div>
          {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-sm text-white px-4 text-center">{media.overview}</p>
          </div> */}
        </div>
        <div className="p-4">
          <h3 className="text-md font-semibold text-neutral dark:text-gray-100 truncate" title={media.title}>
            {media.title}
          </h3>
        </div>
      </Link>
      <button
        onClick={handleToggleWatchLater}
        title={isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
        aria-label={isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
        aria-pressed={isInWatchLater}
        className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 z-10
          ${isInWatchLater
            ? 'bg-secondary hover:bg-amber-400 text-gray-900 focus-visible:ring-amber-500'
            : 'bg-gray-700/60 hover:bg-gray-900/80 dark:bg-gray-600/70 dark:hover:bg-gray-500/90 text-white focus-visible:ring-gray-500'
          }
        `}
      >
        {isInWatchLater ? '✓' : '+'}
      </button>
    </div>
  );
};

export default MediaCard;