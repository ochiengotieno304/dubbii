import React from 'react';
import { Link } from 'react-router-dom';

const RadioPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-neutral dark:text-gray-100 mb-8 border-l-4 border-secondary pl-4 py-1 inline-block">
        Online Radio Streaming
      </h1>
      <div className="bg-primary dark:bg-gray-800 p-8 rounded-xl shadow-xl min-h-[300px] flex flex-col items-center justify-center">
        <svg
          className="w-20 h-20 text-secondary mb-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9zm0 1.5c4.14 0 7.5 3.36 7.5 7.5v.5H4.5v-.5c0-4.14 3.36-7.5 7.5-7.5zM6 15h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
          <circle cx="12" cy="7.5" r="2.5" />
        </svg>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
          Tune in soon!
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Our live radio streams are warming up and will be broadcasting here shortly. Stay tuned for a world of music and talk!
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

export default RadioPage;