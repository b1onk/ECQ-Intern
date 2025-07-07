import { API_KEY, BASE_URL, IMG_BASE } from "./config.js";

export class Leaderboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

//   Gọi api
async fetchTopRated() {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results.slice(0, 10);
  }

createCard(movie, maxVoteAvg, maxVoteCount) {
    const voteAvgPercent = Math.round((movie.vote_average / maxVoteAvg) * 100);
    const voteCountPercent = Math.round((movie.vote_count / maxVoteCount) * 100);

    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
        <img src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}">
        <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="progress-bar bar-green" style="width: ${voteAvgPercent}%"></div>
        <b>⭐ ${movie.vote_average}</b>
        <div class="progress-bar bar-red" style="width: ${voteCountPercent}%"></div>
        <b>👥 ${movie.vote_count.toLocaleString()}</b>
    `;
    return div;
  }

async render() {
  const movies = await this.fetchTopRated();

  const maxVoteAvg = Math.max(...movies.map(m => m.vote_average));
  const maxVoteCount = Math.max(...movies.map(m => m.vote_count));

  const columnContainer = document.createElement("div");
  columnContainer.className = "column-container";

  movies.forEach(movie => columnContainer.appendChild(
    this.createCard(movie, maxVoteAvg, maxVoteCount)
  ));

  this.container.appendChild(columnContainer);
}

}
const leaderboard = new Leaderboard("leaderboard-container");
leaderboard.render();
