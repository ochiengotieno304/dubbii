import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Home', path: '/', type: 'general' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { name: 'Browse All', path: '/browse', type: 'general' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 12.83 5.5 12 4.83 10.5 4 10.5zm0 6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 18.83 5.5 18 4.83 16.5 4 16.5zm0-12C3.17 4.5 2.5 5.17 2.5 6S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm4 0v2h13V4.5H8zm0 14h13v-2H8v2zm0-6h13v-2H8v2z"/></svg> },
  { name: 'Movies', path: '/browse', search: '?type=movie', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg> },
  { name: 'TV Shows', path: '/browse', search: '?type=tv', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM7 15h2V9H7v6zm4-2h2V9h-2v4zm4 0h2V9h-2v4z"/></svg> },
  { name: 'Online Radio', path: '/radio', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 4h-2v-2h2v2z"/></svg> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const TOP_OFFSET_CLASS = "top-20"; // Matches Navbar height

  const isActive = (path: string, searchParam?: string) => {
    const currentPathMatches = location.pathname === path;
    if (searchParam) {
      return currentPathMatches && location.search === searchParam;
    }
    // For "Browse All", it's active if path is /browse and no specific type is in search
    if (path === '/browse' && !searchParam) {
      return currentPathMatches && !location.search.includes('type=');
    }
    return currentPathMatches && (location.search === '' || location.search === '?');
  };

  return (
    <aside
      className={`fixed left-0 ${TOP_OFFSET_CLASS} w-64 h-[calc(100vh-theme(space.20))] 
                 bg-primary dark:bg-gray-900 text-neutral dark:text-gray-200 
                 p-4 shadow-xl hidden md:flex flex-col z-40 overflow-y-auto border-r border-gray-200 dark:border-gray-700/50`}
      aria-label="Main navigation sidebar"
    >
      <nav className="flex flex-col space-y-1.5">
        {NAV_ITEMS.filter(item => item.type === 'general').map(item => (
          <Link
            key={item.name}
            to={{ pathname: item.path, search: item.search }}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
              ${isActive(item.path, item.search)
                ? 'bg-secondary text-gray-900 shadow-md' // Active state: amber bg, dark text
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary dark:hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900'
            }`}
            aria-current={isActive(item.path, item.search) ? 'page' : undefined}
          >
            <item.icon className={`w-5 h-5 fill-current ${isActive(item.path, item.search) ? 'text-gray-900' : 'text-gray-500 dark:text-gray-400 group-hover:text-secondary'}`} />
            <span>{item.name}</span>
          </Link>
        ))}

        <h3 className="pt-4 pb-1.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Categories
        </h3>

        {NAV_ITEMS.filter(item => item.type === 'category').map(item => (
          <Link
            key={item.name}
            to={{ pathname: item.path, search: item.search }}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
              ${isActive(item.path, item.search)
                ? 'bg-secondary text-gray-900 shadow-md' // Active state
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-secondary dark:hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900'
            }`}
            aria-current={isActive(item.path, item.search) ? 'page' : undefined}
          >
             <item.icon className={`w-5 h-5 fill-current ${isActive(item.path, item.search) ? 'text-gray-900' : 'text-gray-500 dark:text-gray-400 group-hover:text-secondary'}`} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;