import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NAV_ITEMS = [
  {
    name: 'Home',
    path: '/',
    type: 'general' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
      </svg>
    ),
  },
  {
    name: 'Browse All',
    path: '/browse',
    type: 'general' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
      </svg>
    ),
  },
  {
    name: 'Movies',
    path: '/browse',
    search: '?type=movie',
    type: 'category' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M4 4h2l2 4h3l-2-4h3l2 4h3l-2-4h3l2 4v12H4V4z" />
      </svg>
    ),
  },
  {
    name: 'TV Shows',
    path: '/browse',
    search: '?type=tv',
    type: 'category' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M3 5c0-1.1.9-2 2-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-5v2H10v-2H5a2 2 0 01-2-2V5zm2 0v12h14V5H5z" />
      </svg>
    ),
  },
  {
    name: 'Top Rated',
    path: '/browse',
    search: '?sort=top_rated&type=movie&min_votes=300',
    type: 'category' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M12 2L14.545 9.526L22 10.262L16.222 15.413L17.633 22L12 18.955L6.367 22L7.778 15.413L2 10.262L9.455 9.526L12 2Z" />
      </svg>
    ),
  },
  {
    name: 'Watch Later',
    path: '/watch-later',
    type: 'personal' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M12 7a1 1 0 011 1v4l3 1a1 1 0 01-.5 1.94l-3.5-1.2A1 1 0 0112 13V8a1 1 0 010-1z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z" />
      </svg>
    ),
  },
  {
    name: 'Online Radio',
    path: '/radio',
    type: 'category' as const,
    icon: (p: any) => (
      <svg {...p} viewBox="0 0 24 24">
        <path d="M20 6H4a2 2 0 00-2 2v8a2 2 0 002 2h6v2h4v-2h6a2 2 0 002-2V8a2 2 0 00-2-2zM12 15a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
    ),
  },
];


export const isActive = (location: ReturnType<typeof useLocation>, path: string, searchParam?: string) => {
  const currentPathMatches = location.pathname === path;
  if (searchParam) {
    const currentSearchParams = new URLSearchParams(location.search);
    const targetSearchParams = new URLSearchParams(searchParam);
    let match = currentPathMatches;
    targetSearchParams.forEach((value, key) => {
      if (currentSearchParams.get(key) !== value) {
        match = false;
      }
    });
    return match;
  }
  // Special handling for '/browse' without specific search params, to avoid matching '/browse?type=movie'
  if (path === '/browse' && !searchParam) {
    return currentPathMatches && !location.search.includes('type=') && !location.search.includes('sort=') && location.search.length <= 1; // only path or path + '?'
  }
  return currentPathMatches && (location.search === '' || location.search === '?');
};

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const TOP_OFFSET_CLASS = "top-20";

  const ChevronDoubleLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
  );

  const ChevronDoubleRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
  );

  const renderNavItems = (type: 'general' | 'category' | 'personal') => NAV_ITEMS.filter(item => item.type === type).map(item => {
    const active = isActive(location, item.path, item.search);
    return (
      <Link
        key={item.name}
        to={{ pathname: item.path, search: item.search }}
        title={!isSidebarOpen ? item.name : undefined}
        className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
          ${isSidebarOpen ? 'px-3 py-2.5 space-x-3' : 'p-3 justify-center'}
          ${active
            ? 'bg-secondary text-gray-900 shadow-md'
            : 'text-neutral dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:text-secondary dark:hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900'
          }`}
        aria-current={active ? 'page' : undefined}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${active ? 'fill-gray-900' : 'fill-gray-500 dark:fill-gray-400 group-hover:fill-secondary dark:group-hover:fill-secondary'}`} />
        {isSidebarOpen && <span>{item.name}</span>}
      </Link>
    );
  });


  return (
    <aside
      className={`fixed left-0 ${TOP_OFFSET_CLASS} h-[calc(100vh-theme(space.20))] 
                 bg-primary dark:bg-gray-900 
                 shadow-xl hidden md:flex flex-col z-40 overflow-y-auto border-r border-gray-200 dark:border-gray-700/50
                 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 p-4' : 'w-20 p-2'}`}
      aria-label="Main navigation sidebar"
    >
      <nav className="flex-grow flex flex-col space-y-1.5">
        {renderNavItems('general')}

        {isSidebarOpen && (
          <h3 className="pt-4 pb-1.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
        )}
        {!isSidebarOpen && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
        {renderNavItems('category')}

        {isSidebarOpen && (
          <h3 className="pt-4 pb-1.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            My Library
          </h3>
        )}
        {!isSidebarOpen && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
        {renderNavItems('personal')}
      </nav>

      <div className={`mt-auto pt-2 ${isSidebarOpen ? '' : 'flex justify-center'}`}>
        <button
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className={`w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group
            ${isSidebarOpen ? 'px-3 py-2.5 space-x-3' : 'p-3 justify-center'}
            hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary dark:hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900
            text-gray-500 dark:text-gray-400`}
        >
          {isSidebarOpen ?
            <ChevronDoubleLeftIcon className="w-5 h-5 fill-current flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-secondary" /> :
            <ChevronDoubleRightIcon className="w-5 h-5 fill-current flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-secondary" />
          }
          {isSidebarOpen && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;