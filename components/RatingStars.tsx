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

  const fullStarPath = "M12 2.00004L14.545 9.52623L22 10.2624L16.2222 15.4131L17.6333 22L12 18.955L6.36668 22L7.77778 15.4131L2 10.2624L9.45452 9.52623L12 2.00004Z";
  const emptyStarPath = "M12 2.00004L14.545 9.52623L22 10.2624L16.2222 15.4131L17.6333 22L12 18.955L6.36668 22L7.77778 15.4131L2 10.2624L9.45452 9.52623L12 2.00004ZM12 6.82759L10.4091 11.8841L5.06349 12.3413L8.63636 15.4731L7.71111 20.5754L12 18.2407L16.2889 20.5754L15.3636 15.4731L18.9365 12.3413L13.5909 11.8841L12 6.82759Z";


  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className={`${starSizeClasses[size]} text-secondary fill-current`} viewBox="0 0 24 24">
          <path d={fullStarPath} />
        </svg>
      ))}
      {halfStar && (
        <svg className={`${starSizeClasses[size]} text-secondary fill-current`} viewBox="0 0 24 24">
          <defs>
            <clipPath id="half-star-clip">
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          {/* Full star path clipped to left half */}
          <path d={fullStarPath} clipPath="url(#half-star-clip)" />
          {/* Empty star as base layer */}
          <path d={emptyStarPath} className="text-gray-300 dark:text-slate-500 fill-current" />
        </svg>
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <svg key={`empty-${i}`} className={`${starSizeClasses[size]} text-gray-300 dark:text-slate-500 fill-current`} viewBox="0 0 24 24">
          <path d={emptyStarPath} />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;