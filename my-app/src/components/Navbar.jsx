import React, { useEffect, useState } from 'react';
import { API_KEY, BASE_URL } from '../api';
import { Link } from 'react-router-dom';

function Navbar() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = localStorage.getItem('session_id');

  useEffect(() => {
    async function fetchUsername() {
      if (sessionId) {
        try {
          const res = await fetch(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`);
          if (!res.ok) throw new Error('API error');
          const data = await res.json();
          setUsername(data.username);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin user:', error);
        }
      }
      setIsLoading(false);
    }

    fetchUsername();
  }, [sessionId]);

  const handleLogout = () => {
    localStorage.removeItem('session_id');
    window.location.href = '/login'; // redirect thay vì reload
  };

  return (
    <header className="header-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-highlight">TMDB</span>
            <div className="logo-pill"></div>
          </Link>

          <ul className="nav-menu">
            <li className="dropdown">
              <span>Movies</span>
              <ul className="dropdown-menu">
                <li><Link to="/movies/popular">Popular</Link></li>
                <li><Link to="/movies/now-playing">Now Playing</Link></li>
                <li><Link to="/movies/upcoming">Upcoming</Link></li>
                <li><Link to="/movies/top-rated">Top Rated</Link></li>
              </ul>
            </li>
            <li><Link to="/tv-shows">TV Shows</Link></li>
            <li className="dropdown">
              <span>People</span>
              <ul className="dropdown-menu">
                <li><Link to="/people/popular">Popular People</Link></li>
                <li><Link to="/people/trending">Trending People</Link></li>
              </ul>
            </li>
            <li><Link to="/more">More</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          {isLoading ? null : sessionId && username ? (
            <>
              <button className="icon-button">+</button>
              <button
                id="logout-button"
                className="icon-button logout-button"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
              <button className="icon-button">🔔</button>
              <div className="user-circle">{username[0].toUpperCase()}</div>
            </>
          ) : (
            <Link to="/login" className="icon-button login-button">Đăng nhập</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
