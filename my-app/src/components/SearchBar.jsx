import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, fetchTrending } from "../api";
import { FaSearch, FaFire } from "react-icons/fa";
import "../App.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrending = async () => {
      const data = await fetchTrending("movie", "day");
      setTrending(data.slice(0, 10));
    };
    loadTrending();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    const data = await searchMovies(value);
    setResults(data.slice(0, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const handleItemClick = (title) => {
    navigate(`/search/${encodeURIComponent(title)}`);
    setFocused(false);
  };

  const showResults = focused && (query.trim() !== "" || trending.length > 0);

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-bar">
        <FaSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a movie, tv show, person..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
      </form>

      {showResults && (
        <div className="search-dropdown">
          {query.trim() !== "" ? (
            results.map((item) => (
              <div
                key={item.id}
                className="search-item"
                onMouseDown={() => handleItemClick(item.title || item.name)}
              >
                <FaSearch className="item-icon" />
                {item.title || item.name}
              </div>
            ))
          ) : (
            <>
              <div className="search-header">
                <FaFire className="item-icon" />
                <strong>Trending</strong>
              </div>
              {trending.map((item) => (
                <div
                  key={item.id}
                  className="search-item"
                  onMouseDown={() => handleItemClick(item.title || item.name)}
                >
                  <FaSearch className="item-icon" />
                  {item.title || item.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
