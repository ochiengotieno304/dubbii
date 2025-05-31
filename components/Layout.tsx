import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { LayoutProvider } from '../contexts/LayoutContext'; // Import the provider

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const CONTENT_TOP_PADDING_CLASS = "pt-20"; // Height of Navbar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const MAIN_CONTENT_MARGIN_EXPANDED = "md:ml-64";
  const MAIN_CONTENT_MARGIN_COLLAPSED = "md:ml-20";

  return (
    <LayoutProvider value={{ isSidebarOpen }}> {/* Provide context value */}
      <div className="min-h-screen flex flex-col bg-base-100 dark:bg-slate-800"> 
        <Navbar />
        <div className={`flex flex-1 ${CONTENT_TOP_PADDING_CLASS}`}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main
            className={`flex-grow overflow-y-auto w-full transition-all duration-300 ease-in-out ${isSidebarOpen ? MAIN_CONTENT_MARGIN_EXPANDED : MAIN_CONTENT_MARGIN_COLLAPSED}`}
            id="main-content"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
        <footer className={`bg-primary dark:bg-gray-900 text-neutral dark:text-gray-300 py-8 text-center border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isSidebarOpen ? MAIN_CONTENT_MARGIN_EXPANDED : MAIN_CONTENT_MARGIN_COLLAPSED}`}>
          <div className="container mx-auto px-4">
            <p className="mb-2">&copy; {new Date().getFullYear()} dubbii. All rights reserved.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Powered by React & Tailwind CSS</p>
            <div className="text-xs text-gray-400 dark:text-gray-500 max-w-2xl mx-auto">
              <p className="font-semibold mb-1">Disclaimer:</p>
              <p>
                None of the content displayed on this site is hosted on our servers. All media is sourced from third-party providers. 
                dubbii is a search engine for publicly available media and does not claim ownership or responsibility for the accuracy, compliance, 
                copyright, legality, decency, or any other aspect of the content of other linked sites. If you have any legal issues please contact 
                the appropriate media file owners or host sites.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LayoutProvider>
  );
};

export default Layout;