import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["Movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (isSuccess && data?.movies.length === 0 && query !== "") {
      toast("No movies found");
    }
  }, [data?.movies.length, isSuccess, query]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };
  const handleSelectMovie = (selectedMovie: Movie) => {
    setSelectedMovie(selectedMovie);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster />
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {data?.movies && data.movies.length > 0 && (
          <ReactPaginate
            pageCount={data?.totalPages ?? 0}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}

        {data?.movies && data.movies.length > 0 && (
          <MovieGrid movies={data?.movies ?? []} onSelect={handleSelectMovie} />
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
