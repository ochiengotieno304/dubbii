// Type: TypeScript File

const apiKey = import.meta.env.VITE_TMDB_API_KEY as string;

export const fetchLatestMovies = (page: number) => {
    return fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`)
        .then(response => response.json())
        .then(json => json.results)
        .catch(error => console.log(error));
}

export const fetchMovieDetails = (id: string) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export const fetchRecommendedMovies = (id: string, page: number) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&page=${page}`)
        .then(response => response.json())
        .then(json => json.results)
        .catch(error => console.log(error));
}

