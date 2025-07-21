import React, { useEffect, useState } from "react";
import { fetchLatestTrailers, IMG_BASE } from "../api";
import "../App.css";

function LatestTrailer() {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchLatestTrailers();
      setTrailers(data);
    };
    getData();
  }, []);

  return (
    <div className="trending-container">
      <div className="trending-header">
        <h2 className="section-title">Latest Trailers</h2>
      </div>
      <div className="slider-wrapper">
        <div className="trending-slider">
          {trailers.map((movie) => (
            <div key={movie.id} className="movie-card-horizontal">
              <div className="poster-wrapper">
                <img
                  src={`${IMG_BASE}${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="trailer-overlay">
                  <a
                    href={`https://www.youtube.com/watch?v=${movie.trailer_key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trailer-btn"
                  >
                    ▶ Watch Trailer
                  </a>
                </div>
              </div>
              <p className="movie-title">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestTrailer;
