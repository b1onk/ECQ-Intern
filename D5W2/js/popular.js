import { API_KEY, BASE_URL, IMG_BASE } from "./config.js";

export class PopularTab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.grid = document.createElement("div");
    this.grid.className = "movie-grid";
  }

  async fetchPopular(type = "movie") {
    const res = await fetch(`${BASE_URL}/${type}/popular?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results.slice(0, 10);
  }

  createCard(item) {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${IMG_BASE}${item.poster_path}" alt="${item.title || item.name}">
      <h3>${item.title || item.name}</h3>
      <p>⭐ ${item.vote_average}</p>
    `;
    return div;
  }

  async load(type) {
    this.grid.innerHTML = "";
    const data = await this.fetchPopular(type);
    data.forEach(item => this.grid.appendChild(this.createCard(item)));
  }

  render() {
    const btnMovie = document.createElement("button");
    btnMovie.textContent = "Movies";
    btnMovie.onclick = () => this.load("movie");

    const btnTV = document.createElement("button");
    btnTV.textContent = "TV Shows";
    btnTV.onclick = () => this.load("tv");

    this.container.appendChild(btnMovie);
    this.container.appendChild(btnTV);
    this.container.appendChild(this.grid);

    this.load("movie");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const popularTab = new PopularTab("popular-container");
  popularTab.render();
});
