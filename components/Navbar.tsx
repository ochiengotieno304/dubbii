import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { NAV_ITEMS, isActive as checkIsActive } from './Sidebar'; // Import NAV_ITEMS and isActive

const HamburgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMobileNavItems = (type: 'general' | 'category' | 'personal') => NAV_ITEMS.filter(item => item.type === type).map(item => {
    const active = checkIsActive(location, item.path, item.search);
    return (
      <Link
        key={`mobile-${item.name}`}
        to={{ pathname: item.path, search: item.search }}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center px-4 py-3 space-x-3 rounded-lg text-base font-medium transition-colors duration-200 ease-in-out group
        ${active
            ? 'bg-secondary text-gray-900 shadow-sm'
            : 'text-neutral dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-secondary dark:hover:text-secondary'
          }`}
        aria-current={active ? 'page' : undefined}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${active ? 'fill-gray-900' : 'fill-gray-500 dark:fill-gray-400 group-hover:fill-secondary dark:group-hover:fill-secondary'}`} />
        <span>{item.name}</span>
      </Link>
    )
  });

  return (
    <>
      <nav className="bg-primary dark:bg-gray-900 shadow-lg sticky top-0 z-50 h-20 border-b border-gray-200 dark:border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Hamburger Menu Button - visible on md and below */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-neutral dark:text-gray-200 hover:text-secondary dark:hover:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              {isMobileMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <HamburgerIcon className="block h-6 w-6" />}
            </button>
          </div>

          <Link
            to="/"
            className="text-secondary text-3xl md:text-4xl font-extrabold hover:text-amber-300 transition-colors duration-300 flex-shrink-0 tracking-tight"
            aria-label="dubbii Homepage"
          >
            Dubbii
          </Link>


          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-full max-w-[150px] sm:max-w-xs md:w-64 lg:w-72"> {/* Adjusted width for mobile */}
              <SearchBar />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-20 z-40 bg-primary dark:bg-gray-900 transition-transform duration-300 ease-in-out transform"
          id="mobile-menu"
          style={{ transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)' }}
        // Add focus trap or manage focus appropriately for accessibility if time permits
        >
          <div className="pt-2 pb-3 space-y-1 px-2 h-[calc(100vh-5rem)] overflow-y-auto">
            {renderMobileNavItems('general')}

            <h3 className="pt-4 pb-1.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </h3>
            {renderMobileNavItems('category')}

            <h3 className="pt-4 pb-1.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              My Library
            </h3>
            {renderMobileNavItems('personal')}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;