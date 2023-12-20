import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import MoviePage from './pages/MoviePage.tsx';
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme.ts';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id/:name" element={<MoviePage />} />
        <Route path="*" element={<ErrorPage />} />
      </>
    )
  )

  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};

export default App;