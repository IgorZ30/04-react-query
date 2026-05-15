import type { Movie } from "../types/movie";
import axios from "axios";
interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<{ movies: Movie[]; totalPages: number }> => {
  const response = await axios.get<MoviesResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
};
