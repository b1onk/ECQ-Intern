import React, { useEffect, useState } from "react";
import { fetchPopularPeople } from "../api";
import { Link } from "react-router-dom";
import "../App.css";

function PopularPeople() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadPeople = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularPeople(page);
        setPeople((prev) => [...prev, ...data.results]);
      } catch (err) {
        console.error("Lỗi khi fetch popular people:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, [page]);

  return (
    <div className="movie-list-page">
      <h2 className="section-title">Popular People</h2>

      {loading && page === 1 ? (
        <p>Đang tải...</p>
      ) : (
        <div className="movie-grid">
          {people.map((person) => (
            <Link
              to={`/person/${person.id}`}
              key={person.id}
              className="movie-card-vertical"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={person.name}
                className="movie-poster"
              />
              <h4 className="movie-title">{person.name}</h4>
              <p className="movie-date">
                👤 {person.known_for_department || "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Nút Load More */}
      <div className="load-more-wrapper">
        <button
          className="load-more-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
        >
          ⬇ Load More
        </button>
      </div>
    </div>
  );
}

export default PopularPeople;
