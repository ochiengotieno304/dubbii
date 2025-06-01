import React from 'react';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  isLoading?: boolean;
  isSidebarOpen?: boolean; // Prop to adjust layout based on sidebar state
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, isLoading, isSidebarOpen = true }) => {
  // Determine grid layout classes based on sidebar state
  // Base: 2 columns, sm: 3 columns, md: 3 (sidebar open) or 4 (sidebar closed), etc.
  const gridLayoutClasses = isSidebarOpen
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6' // Sidebar open
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6'; // Sidebar closed

  // Adjust skeleton item count to roughly fill two/three rows on smaller screens for both states
  const skeletonItemCount = 6;

  if (isLoading) {
    return (
      <div className={`grid ${gridLayoutClasses} gap-4 md:gap-6`}> {/* Adjusted gap for potentially smaller cards */}
        {Array.from({ length: skeletonItemCount }).map(() => (
          <div key={crypto.randomUUID()} className="bg-primary dark:bg-gray-800 rounded-lg shadow-xl animate-pulse">
            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <div className="p-3 md:p-4"> {/* Adjusted padding */}
              <div className="h-5 md:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1.5 md:mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1.5 md:mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 md:mb-3"></div>
              <div className="h-10 md:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
    <div className={`grid ${gridLayoutClasses} gap-4 md:gap-6`}> {/* Adjusted gap */}
      {items.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} media={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
