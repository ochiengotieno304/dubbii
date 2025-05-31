import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current w-5 h-5">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM5.106 17.834a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current w-5 h-5">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.634 4.372-8.451a.75.75 0 01.819.162z" clipRule="evenodd" />
  </svg>
);

const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current w-5 h-5">
    <path d="M3 5.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 5.25V15a2.25 2.25 0 01-2.25 2.25H15a.75.75 0 000 1.5h.75a.75.75 0 010 1.5H8.25a.75.75 0 010-1.5H9a.75.75 0 000-1.5H5.25A2.25 2.25 0 013 15V5.25zM5.25 5.25V15H18.75V5.25H5.25z" />
  </svg>
);


const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { name: 'light' as const, icon: <SunIcon />, label: 'Light Mode' },
    { name: 'dark' as const, icon: <MoonIcon />, label: 'Dark Mode' },
    { name: 'system' as const, icon: <DesktopIcon />, label: 'System Default' },
  ];

  return (
    <div className="flex items-center space-x-0.5 p-0.5 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-inner-sm">
      {themes.map((t) => (
        <button
          key={t.name}
          title={t.label}
          onClick={() => setTheme(t.name)}
          className={`p-2.5 rounded-lg transition-all duration-200 ease-in-out icon-button
            ${
            theme === t.name
              ? 'bg-primary dark:bg-gray-600 shadow-md ring-1 ring-inset ring-gray-300 dark:ring-gray-500' 
              : 'hover:bg-gray-300/70 dark:hover:bg-gray-600/70'
          }
          ${ theme === t.name && resolvedTheme === 'light' ? 'text-secondary' : 
             theme === t.name && resolvedTheme === 'dark' ? 'text-secondary' :
             'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }
          `}
          aria-pressed={theme === t.name}
        >
          {t.icon}
          <span className="sr-only">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;