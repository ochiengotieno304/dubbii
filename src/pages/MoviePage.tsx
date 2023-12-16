import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import Iframe from "react-iframe";
// import VideoPlayer from "../components/VideoPlayer";



const MoviePage = () => {
  // const movieId = useParams();
  const { id } = useParams<{ id: string }>();
  const [movieId, setMovieId] = React.useState<any>(466420);

  useEffect(() => { setMovieId(id) }, [id]);

  return (
    <div>
      <h1>Movie Page</h1>
      {/* <VideoPlayer videoUrl={`https://vidsrc.to/embed/movie/${movie}`} /> */}

      <Iframe url={`https://vidsrc.me/embed/${movieId}`}
            position="absolute"
            width="60%"
            height="60%"/>
    </div>
  );
}

export default MoviePage;

