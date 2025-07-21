// src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { searchAll } from "../api/index";
import "../App.css"; // Import your main CSS file

function Search() {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const data = await searchAll(query);
      setResults(data);
      setFiltered(data);
    };

    fetchResults();
  }, [query]);

  const handleFilter = (type) => {
    setActiveType(type);
    if (type === "all") {
      setFiltered(results);
    } else {
      setFiltered(results.filter((item) => item.media_type === type));
    }
  };

  const countByType = (type) =>
    results.filter((item) => item.media_type === type).length;

  return (
    <div className="search-container">
      {/* Sidebar */}
      <aside className="search-sidebar">
        <h3 className="sidebar-title">Search Results</h3>
        <ul className="filter-list">
          {["all", "movie", "tv", "collection"].map((type) => (
            <li
              key={type}
              className={`filter-item ${
                activeType === type ? "active" : ""
              }`}
              onClick={() => handleFilter(type)}
            >
              {type === "all"
                ? "All"
                : type === "movie"
                ? "Movies"
                : type === "tv"
                ? "TV Shows"
                : "Collections"}{" "}
              <span className="count">
                ({type === "all" ? results.length : countByType(type)})
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="search-content">
        <h2 className="search-title">
          Kết quả tìm kiếm cho:{" "}
          <span className="query">{decodeURIComponent(query)}</span>
        </h2>

        {filtered.length > 0 ? (
          <div className="result-list">
            {filtered.map((item) => (
              <div key={item.id} className="result-card">
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
                      : "https://via.placeholder.com/154x231?text=No+Image"
                  }
                  alt={item.title || item.name}
                  className="result-img"
                />
                <div className="result-info">
                  <h3 className="result-name">{item.title || item.name}</h3>
                  <p className="result-date">
                    {item.release_date || item.first_air_date || "Unknown date"}
                  </p>
                  <p className="result-overview">
                    {item.overview || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">Không có kết quả nào.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
