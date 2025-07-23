import React, { useEffect, useState } from "react";
import { API_KEY, BASE_URL, IMG_BASE } from "../api";
import "../App.css";

function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // filter
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");

  // Gọi API mỗi khi filter hoặc page thay đổi
  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          api_key: API_KEY,
          sort_by: "popularity.desc",
          page: page.toString(),
        });

        if (minRating > 0) params.append("vote_average.gte", minRating);
        if (year) params.append("primary_release_year", year);
        if (language) params.append("with_original_language", language);

        const res = await fetch(`${BASE_URL}/discover/movie?${params}`);
        const data = await res.json();

        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }

        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Lỗi khi fetch filtered movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [page, minRating, year, language]);

  // Khi filter thay đổi, reset page về 1
  useEffect(() => {
    setPage(1);
  }, [minRating, year, language]);

  return (
    <div className="page-container">
      {/* Sidebar filter bên trái */}
      <aside className="sidebar">
        <h3>Bộ lọc</h3>

        <div className="filter-group">
          <label>Rating:</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>Tất cả</option>
            <option value={5}>5+</option>
            <option value={6}>6+</option>
            <option value={7}>7+</option>
            <option value={8}>8+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Năm phát hành:</label>
          <input
            type="text"
            value={year}
            placeholder="e.g. 2023"
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Ngôn ngữ:</label>
          <input
            type="text"
            value={language}
            placeholder="en, vi, ja..."
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </aside>

      {/* Main content - phim */}
      <main className="movie-main">
        <h2 className="section-title">🎬 Popular Movies</h2>

        {loading && page === 1 ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card-vertical">
                  <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <h4 className="movie-title">{movie.title}</h4>
                  <p className="movie-date">{movie.release_date}</p>
                  <p className="movie-rating">⭐ {movie.vote_average}</p>
                </div>
              ))}
            </div>

            {/* Load more button */}
            {page < totalPages && (
              <div className="load-more-wrapper">
                <button className="load-more-btn" onClick={() => setPage((p) => p + 1)}>
                   Load More
                </button>
              </div>
            )}

            {loading && page > 1 && <p>Đang tải thêm...</p>}
          </>
        )}
      </main>
    </div>
  );
}

export default PopularMovies;
