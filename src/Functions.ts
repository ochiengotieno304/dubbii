
export const sum = (a: number, b: number) => {
    return a + b;
}

export const substract = (a: number, b: number) => {
    return a - b;
}

export const multiply = (a: number, b: number) => {
    return a * b;
}

export const divide = (a: number, b: number) => {
    return a / b;
}

const apiKey = import.meta.env.VITE_TMDB_API_KEY as string;
export const fetchLatestMovies = (page: number) => {
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`)
        .then(response => response.json())
        .then(json => json.results)
        .catch(error => console.log(error));
}

export const fetchMovieDetails = (id: number) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
        .then(response => response.json())
        .catch(error => console.log(error));
}

