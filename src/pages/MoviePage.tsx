import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import BaseLayout from "./BaseLayout";
import { fetchMovieDetails } from "../Functions";
import MovieCard from "./MovieCard";

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<any>(null);

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
    }
  }, [id]);

  return (
    <BaseLayout position="absolute">
      {movieDetails && (
        <>
          <Iframe
            url={`https://vidsrc.me/embed/${id}`}
            width={'1000'}
            height={'500'}
            allow="accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture full"
          />

          <MovieCard movieData={movieDetails} />
        </>
      )}
    </BaseLayout>
  );
}

export default MoviePage;