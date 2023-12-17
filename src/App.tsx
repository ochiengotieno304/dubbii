import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import MoviePage from './pages/MoviePage.tsx';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="*" element={<ErrorPage />} />
      </>
    )
  )

  return (
    <RouterProvider router={router} />
  );
};

export default App;