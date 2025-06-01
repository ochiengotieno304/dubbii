import React from 'react';
import { Link } from 'react-router-dom';

const LiveSports: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-neutral dark:text-gray-100 mb-8 border-l-4 border-secondary pl-4 py-1 inline-block">
        Live Sports Streaming
      </h1>
      <div className="bg-primary dark:bg-gray-800 p-8 rounded-xl shadow-xl min-h-[300px] flex flex-col items-center justify-center">
        <svg
          className="w-20 h-20 text-secondary mb-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a10 10 0 010 20M4.22 4.22l15.56 15.56M4.22 19.78L19.78 4.22" stroke="white" strokeWidth="1.5" />
        </svg>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
          Dropping soon!
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Our live sports streams are warming up and will be broadcasting here shortly. Stay tuned for a world of sports action!
        </p>
        <Link
          to="/"
          className="bg-secondary text-gray-900 hover:bg-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black/50 font-bold py-2.5 px-5 md:py-3 md:px-7 rounded-lg text-sm md:text-base transition-all duration-300 ease-in-out inline-block shadow-lg hover:shadow-xl active:scale-95 transform"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default LiveSports;