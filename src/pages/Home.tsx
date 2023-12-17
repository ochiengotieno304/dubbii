import React from 'react';
import { Flex } from 'antd';
import { fetchLatestMovies } from '../Functions.ts';
import MovieCard from '../components/MovieCard.tsx';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout.tsx';


const Home = () => {
  const [latestMovies, setLatestMovies] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();

  const onClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  React.useEffect(() => {
    fetchLatestMovies(page).then((movies) => setLatestMovies(movies || []));
    setPage(31);
  }, []);

  return (
    <BaseLayout>

      <Flex gap={'large'} wrap='wrap'>
        {latestMovies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            movieTitle={movie.title}
            movieOverview={movie.overview}
            moviePosterPath={movie.poster_path}
            onClick={() => {
              console.log('clicked')
              onClick(movie.id)
            }
            }
          />
        ))}
      </Flex>
    </BaseLayout>

  );
};

export default Home;
