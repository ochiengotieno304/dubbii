import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NAV_ITEMS = [
  { name: 'Home', path: '/', type: 'general' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { name: 'Browse All', path: '/browse', type: 'general' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 12.83 5.5 12 4.83 10.5 4 10.5zm0 6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 18.83 5.5 18 4.83 16.5 4 16.5zm0-12C3.17 4.5 2.5 5.17 2.5 6S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm4 0v2h13V4.5H8zm0 14h13v-2H8v2zm0-6h13v-2H8v2z"/></svg> },
  { name: 'Movies', path: '/browse', search: '?type=movie', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg> },
  { name: 'TV Shows', path: '/browse', search: '?type=tv', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM7 15h2V9H7v6zm4-2h2V9h-2v4zm4 0h2V9h-2v4z"/></svg> },
  { name: 'Top Rated', path: '/browse', search: '?sort=top_rated&type=movie&min_votes=300', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 4.81 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> },
  { name: 'Watch Later', path: '/watch-later', type: 'personal' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M14.5 12a.5.5 0 00-.5.5v2.5H12a.5.5 0 000 1h2.5a.5.5 0 00.5-.5V12.5a.5.5 0 00-.5-.5z"/><path d="M7 5.5A1.5 1.5 0 018.5 4h7A1.5 1.5 0 0117 5.5v1A1.5 1.5 0 0115.5 8H14v-.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5v.5H8.5A1.5 1.5 0 017 6.5v-1zm1.5.5h7V6h-7V6z"/><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 16H6a1 1 0 01-1-1V9h14v9a1 1 0 01-1 1zm0-11H5V6a1 1 0 011-1h12a1 1 0 011 1v2z"/></svg> }, // Updated icon
  { name: 'Online Radio', path: '/radio', type: 'category' as const, icon: (p:any) => <svg {...p} viewBox="0 0 24 24"><path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 4h-2v-2h2v2z"/></svg> },
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
    return currentPathMatches && !location.search.includes('type=') && !location.search.includes('sort=') && location.search.length <=1 ; // only path or path + '?'
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