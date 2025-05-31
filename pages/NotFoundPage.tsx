import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-260px)] text-center px-4 py-10"> {/* Adjusted min-height and padding */}
      <img 
        src="https://picsum.photos/seed/404dubbii/400/300" // Changed seed for a potentially different image
        alt="Lost signal or empty cinema" 
        className="rounded-xl shadow-2xl mb-8 w-full max-w-md opacity-80 dark:opacity-70 transition-opacity duration-500" 
      />
      <h1 className="text-7xl md:text-8xl font-extrabold text-secondary mb-3 tracking-tighter">404</h1>
      <p className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Oops! Page Not Found.</p>
      <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg">
        It seems the page you're looking for has wandered off into the digital ether. 
        Let's get you back on track.
      </p>
      <Link
        to="/"
        className="px-8 py-3.5 bg-secondary text-gray-900 font-bold rounded-xl shadow-lg hover:bg-amber-300 hover:shadow-xl transition-all duration-300 ease-in-out text-lg transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-base-100"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;