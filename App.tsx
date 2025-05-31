import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import RadioPage from './pages/RadioPage';
import WatchLaterPage from './pages/WatchLaterPage'; // Import the new WatchLaterPage

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/media/:type/:id" element={<DetailPage />} />
        <Route path="/radio" element={<RadioPage />} />
        <Route path="/watch-later" element={<WatchLaterPage />} /> {/* Add route for WatchLaterPage */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;