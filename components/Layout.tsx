import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const CONTENT_TOP_PADDING_CLASS = "pt-20"; // Height of Navbar

  return (
    <div className="min-h-screen flex flex-col"> 
      <Navbar />
      <div className={`flex flex-1 ${CONTENT_TOP_PADDING_CLASS}`}>
        <Sidebar />
        <main
          className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:ml-64 overflow-y-auto w-full" // Ensure main content can use full width after sidebar offset
          id="main-content"
        >
          {children}
        </main>
      </div>
      <footer className="bg-primary dark:bg-gray-900 text-neutral dark:text-gray-300 py-8 text-center md:ml-64 border-t border-gray-200 dark:border-gray-700">
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
  );
};

export default Layout;