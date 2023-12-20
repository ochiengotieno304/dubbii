import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Container, SimpleGrid, Divider, Heading } from "@chakra-ui/react";
import Iframe from "react-iframe";
import BaseLayout from "./BaseLayout";
import { fetchMovieDetails, fetchRecommendedMovies } from "../Functions";
import MovieCardDetails from "./MovieCardDetails";
import MovieCard from "../components/MovieCard";
import { useNavigate } from 'react-router-dom';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<any>([]);
  const navigate = useNavigate();

  const onClick = (movieId: string, movieTitle: string) => {
    const movieTtl = movieTitle.replace(/\s+/g, '-').toLowerCase();
    navigate(`/movie/${movieId}/${movieTtl}`);
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id)
        .then((response: any) => {
          const { genres, title, poster_path, backdrop_path, production_companies, production_countries, release_date, spoken_languages, vote_average, adult, overview } = response;
          const moviedata = {
            genres,
            title,
            overview,
            poster: poster_path,
            backdrop: backdrop_path,
            production: production_companies,
            country: production_countries,
            release: release_date,
            languages: spoken_languages,
            rating: vote_average,
            adult
          };
          setMovieDetails(moviedata);
        })
        .catch((error) => console.log(error));

      fetchRecommendedMovies(id, 1)
        .then((movies) => setRecommendedMovies(movies || []))
        .catch((error) => console.log(error));

    }
  }, [id]);

  return (
    <BaseLayout>
      {movieDetails && (
        <Container maxW="container.lg" mt={4}>
          <Iframe
            url={`https://vidsrc.me/embed/${id}`}
            width="100%"
            height="500px"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={`${movieDetails.title}`}
          />

          <Box mt={4}>
            <MovieCardDetails movieData={movieDetails} />
          </Box>

          {recommendedMovies.length > 0 && (
            <>
              <Divider my={6} />
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  Recommended Movies
                </Heading>
                <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                  {recommendedMovies.map((movie: any) => (
                    <MovieCard
                      key={movie.id}
                      movieId={movie.id}
                      movieTitle={movie.title}
                      movieOverview={movie.overview}
                      moviePosterPath={movie.poster_path}
                      onClick={() => {
                        onClick(movie.id, movie.title);
                      }}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </>
          )}
        </Container>
      )}
    </BaseLayout>
  );
}

export default MoviePage;
