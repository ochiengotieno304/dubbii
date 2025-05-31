import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { WatchLaterProvider } from './contexts/WatchLaterContext'; // Added

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <WatchLaterProvider> {/* Added */}
          <App />
        </WatchLaterProvider> {/* Added */}
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);