import type { Movie } from "../types/movie";
import axios from "axios";
interface MoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MoviesResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        language: "en-US",
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  return response.data.results;
};
