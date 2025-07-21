import React, { useEffect, useState } from "react";
import { fetchPopularTVShows } from "../api";
import { IMG_BASE } from "../api";
import "../App.css";

function PopularTV() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minRating, setMinRating] = useState(0);
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const loadTV = async () => {
      try {
        const data = await fetchPopularTVShows();
        setShows(data);
      } catch (err) {
        console.error("Lỗi khi fetch popular TV shows:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTV();
  }, []);

  const filteredShows = shows.filter((show) => {
    const voteOk = show.vote_average >= minRating;
    const langOk = language ? show.original_language === language : true;
    const yearOk = year ? show.first_air_date?.startsWith(year) : true;
    return voteOk && langOk && yearOk;
  });

  return (
    <div className="page-container" >
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Bộ lọc</h3>

        <div className="filter-group">
          <label> Rating:</label>
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
            <option value={0}>Tất cả</option>
            <option value={5}>5+</option>
            <option value={6}>6+</option>
            <option value={7}>7+</option>
            <option value={8}>8+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ngôn ngữ:</label>
          <input
            type="text"
            placeholder="en, ja, vi..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Năm phát hành:</label>
          <input
            type="text"
            placeholder="e.g. 2023"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </aside>

      {/* Main TV show grid */}
      <main className="movie-main">
        <h2 className="section-title">📺 Popular TV Shows</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="movie-grid">
            {filteredShows.map((tv) => (
              <div key={tv.id} className="movie-card-vertical">
                <img
                  src={`${IMG_BASE}${tv.poster_path}`}
                  alt={tv.name}
                  className="movie-poster"
                />
                <h4 className="movie-title">{tv.name}</h4>
                <p className="movie-date">{tv.first_air_date}</p>
                <p className="movie-rating">⭐ {tv.vote_average}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PopularTV;
