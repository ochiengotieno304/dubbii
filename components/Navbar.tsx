import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary dark:bg-gray-900 shadow-lg sticky top-0 z-50 h-20 border-b border-gray-200 dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link
          to="/"
          className="text-secondary text-3xl md:text-4xl font-extrabold hover:text-amber-300 transition-colors duration-300 flex-shrink-0 tracking-tight"
          aria-label="dubbii Homepage"
        >
          dubbii
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="text-neutral dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-secondary dark:hover:text-secondary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="text-neutral dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-secondary dark:hover:text-secondary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Browse
            </Link>
          </div>
          <div className="w-full md:w-64 lg:w-72">
             <SearchBar />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;