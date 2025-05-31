import React from 'react';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  isLoading?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-primary dark:bg-gray-800 rounded-lg shadow-xl animate-pulse">
            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} media={item} />
      ))}
    </div>
  );
};

export default MediaGrid;