
import React from 'react';
import { Link } from 'react-router-dom';
import { useWatchLater } from '../contexts/WatchLaterContext';
import MediaGrid from '../components/MediaGrid';
import { MediaItem } from '../types';
import { useLayoutContext } from '../contexts/LayoutContext'; // Import context hook

const WatchLaterPage: React.FC = () => {
  const { watchLaterItems } = useWatchLater();
  const { isSidebarOpen } = useLayoutContext(); // Consume context

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 border-l-4 border-secondary pl-4 py-1 mb-4 sm:mb-0">
          My Watch Later List
        </h1>
        {watchLaterItems.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
                You have {watchLaterItems.length} item{watchLaterItems.length !== 1 ? 's' : ''} saved.
            </p>
        )}
      </div>

      {watchLaterItems.length === 0 ? (
        <div className="text-center py-20 bg-primary dark:bg-gray-800 rounded-xl shadow-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c.1.121.1.329 0 .45l-6.625 8.281a.5.5 0 01-.74 0L3.601 3.772a.298.298 0 010-.451c.1-.12.319-.12.45 0l6.374 7.968 6.373-7.968a.299.299 0 01.45-.001z" transform="translate(0 4)"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 2.5h14a.5.5 0 01.5.5v16a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5" /> 
          </svg>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Your Watch Later list is empty.</p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Start exploring and add movies or TV shows you want to watch later!
          </p>
          <Link
            to="/browse"
            className="px-6 py-3 bg-secondary text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors duration-300 text-lg"
          >
            Browse Media
          </Link>
        </div>
      ) : (
        // The MediaCard component itself handles removal via its bookmark icon
        <MediaGrid items={watchLaterItems as MediaItem[]} isSidebarOpen={isSidebarOpen} />
      )}
    </div>
  );
};

export default WatchLaterPage;
