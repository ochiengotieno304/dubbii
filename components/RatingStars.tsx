import React from 'react';

interface RatingStarsProps {
  rating: number; // Current rating, e.g. 7.5
  maxRating?: number; // Maximum rating, e.g. 10
  totalStars?: number; // Number of stars to display, e.g. 5
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 10,
  totalStars = 5,
  size = 'sm',
}) => {
  const normalizedRating = (rating / maxRating) * totalStars;
  const fullStars = Math.floor(normalizedRating);
  const halfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  const starSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Correct, complete path for a 5-point star
  const fullStarPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 4.81 8.63 2 9.24l5.46 4.73L5.82 21z";
  // Path for the left half of the full star
  const halfStarPath = "M12 17.27V2L4.81 8.63 2 9.24l5.46 4.73L5.82 21L12 17.27z";
  // Path for an empty/outline star (outer path M inner path)
  const emptyStarPath = "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z";


  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className={`${starSizeClasses[size]} text-secondary fill-current`} viewBox="0 0 24 24">
          <path d={fullStarPath} />
        </svg>
      ))}
      {halfStar && (
        <svg className={`${starSizeClasses[size]} text-secondary fill-current`} viewBox="0 0 24 24">
          <path d={halfStarPath} />
        </svg>
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <svg key={`empty-${i}`} className={`${starSizeClasses[size]} text-gray-300 dark:text-slate-500 fill-current`} viewBox="0 0 24 24">
          {/* The emptyStarPath creates an outline effect when filled due to its M path1 M path2 structure with default fill-rule */}
          <path d={emptyStarPath} />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;