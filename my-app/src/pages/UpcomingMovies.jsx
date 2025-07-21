import React, { useEffect, useState } from "react";
import { fetchUpcomingMovies } from "../api";
import { IMG_BASE } from "../api";
import "../App.css";

function UpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingMovies(page);
        setMovies((prev) => [...prev, ...data.results]);
      } catch (err) {
        console.error("Lỗi fetch upcoming movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page]);

  // Lọc phim có ngày phát hành >= hôm nay
  const today = new Date();
  const upcomingFiltered = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate >= today;
  });

  //Lọc theo ngôn ngữ
  const filteredMovies = upcomingFiltered.filter((movie) =>
    language ? movie.original_language === language : true
  );

  return (
    <div className="page-container">
      {/* Bộ lọc */}
      <aside className="sidebar">
        <h3>Lọc</h3>
        <div className="filter-group">
          <label>Ngôn ngữ:</label>
          <input
            type="text"
            placeholder="en, vi, ja..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </aside>

      {/* Grid phim */}
      <main className="movie-main">
        <h2 className="section-title">Upcoming Movies</h2>

        {loading && page === 1 ? (
          <p>Đang tải...</p>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="movie-card-vertical">
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_BASE}${movie.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={movie.title}
                  className="movie-poster"
                />
                <h4 className="movie-title">{movie.title}</h4>
                <p className="movie-date">{movie.release_date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="load-more-wrapper">
          <button
            className="load-more-btn"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            ⬇ Load More
          </button>
        </div>
      </main>
    </div>
  );
}

export default UpcomingMovies;
