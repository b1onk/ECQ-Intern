import React from 'react';
import SearchBar from '../components/SearchBar';
import TrendingList from '../components/Trending'; // Không cần .jsx
import Footer from '../components/Footer';
import LatestTrailer from '../components/LatestTrailer'; // Không cần .jsx
function Home() {
  return (
    <div className="home-page">
      
      <SearchBar />

      <TrendingList />
      <LatestTrailer/>
      <Footer />
    </div>
  );
}

export default Home;
