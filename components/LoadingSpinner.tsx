
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-secondary
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-secondary' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} ${color} border-4 border-t-transparent border-solid rounded-full animate-spin`}
      ></div>
    </div>
  );
};
    