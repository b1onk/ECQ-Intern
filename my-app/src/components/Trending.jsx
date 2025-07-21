import React, { useEffect, useState, useRef } from "react";
import { fetchTrending } from "../api";
import { IMG_BASE } from "../api";
import MovieCard from "./MovieCard";
import "../App.css";

function TrendingList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState("day");
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      try {
        const data = await fetchTrending("movie", timeWindow);
        setMovies(data);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, [timeWindow]);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const scrollWidth = e.target.scrollWidth - e.target.clientWidth;
    const slider = document.getElementById("scroll-bar");
    if (slider) {
      slider.value = (scrollLeft / scrollWidth) * 100;
    }
  };



  return (
    <div className="trending-container">
      <div className="trending-header">
        <div className="time-switch">
          <button
            className={timeWindow === "day" ? "active" : ""}
            onClick={() => setTimeWindow("day")}
          >
            Today
          </button>
          <button
            className={timeWindow === "week" ? "active" : ""}
            onClick={() => setTimeWindow("week")}
          >
            This Week
          </button>
        </div>
        <h2>🔥 Trending</h2>
      </div>

      <div className="slider-wrapper">
        <div
          className="trending-slider"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="movie-card-horizontal">
                <div className="poster-wrapper">
                  <img
                    src={IMG_BASE + movie.poster_path}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="rating-circle">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="movie-title">{movie.title}</h4>
                <p className="movie-date">{movie.release_date}</p>
                <div className="equalizer-bar"></div>
              </div>
            ))
          )}
        </div>

        
      </div>
    </div>
  );
}

export default TrendingList;
