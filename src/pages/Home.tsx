import React from 'react';
import { fetchLatestMovies } from '../Functions.ts';
import MovieCard from '../components/MovieCard.tsx';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout.tsx';
import { SimpleGrid } from '@chakra-ui/react';


const Home = () => {
  const [latestMovies, setLatestMovies] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();

  const onClick = (movieId: string, movieTitle: string) => {
    const movieTtl = movieTitle.replace(/\s+/g, '-').toLowerCase();
    navigate(`/movie/${movieId}/${movieTtl}`);
  };

  React.useEffect(() => {
    fetchLatestMovies(page).then((movies) => setLatestMovies(movies || []));
    setPage(31);
  }, []);

  return (
    <BaseLayout>

      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {latestMovies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            movieTitle={movie.title}
            movieOverview={movie.overview}
            moviePosterPath={movie.poster_path}
            onClick={() => {
              onClick(movie.id, movie.title)
              console.log('clicked')
            }}
          />
        ))}
      </SimpleGrid>

    </BaseLayout>

  );
};

export default Home;
