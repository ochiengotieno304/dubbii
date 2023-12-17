import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import BaseLayout from "./BaseLayout";
import { fetchMovieDetails } from "../Functions";
import moment from "moment";

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
            position="relative"
            display="block"
            width="640px"
            height="320px"
          />

          {movieDetails.title}
          <br />
          {movieDetails.overview}
          <br />
          {movieDetails.poster}
          <br />
          {movieDetails.backdrop}
          <br />
          {movieDetails.rating}
          <br />
          {moment(movieDetails.release).format('MMMM Do YYYY')}
          <br />
          {movieDetails.production.map((company: any) => {
            return (
              <>
                {company?.name}
                <br />
              </>
            );
          })}
          {movieDetails.genres.map((genre: any) => {
            return (
              <>
                {genre?.name}
                <br />
              </>
            );
          })}
          {movieDetails.country.map((country: any) => {
            return (
              <>
                {country?.name}
                <br />
              </>
            );
          })}
          {movieDetails.languages.map((language: any) => {
            return (
              <>
                {language?.name}
                <br />
              </>
            );
          })}
        </>




      )}
    </BaseLayout>
  );
}

export default MoviePage;