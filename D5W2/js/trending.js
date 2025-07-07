import { API_KEY } from "./config.js";

class Trending {
  constructor() {
    this.baseURL = "https://api.themoviedb.org/3/trending";
    this.mediaType = "all";
    this.timeWindow = "day"; 
    this.container = document.getElementById("trending-container");

    this.setupEvents();
    this.fetchTrending();
  }

  setupEvents() {
    document.getElementById("day-mode").addEventListener("change", () => {
      this.timeWindow = "day";
      this.fetchTrending();
    });

    document.getElementById("week-mode").addEventListener("change", () => {
      this.timeWindow = "week";
      this.fetchTrending();
    });
  }

  async fetchTrending() {
    const url = `${this.baseURL}/${this.mediaType}/${this.timeWindow}?api_key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      this.renderTrending(data.results);
    } catch (error) {
      console.log("Lỗi khi fetch trending:", error);
    }
  }

  renderTrending(items) {
    this.container.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = item.title || item.name;
      const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "";
      const rating = item.vote_average ? Math.round(item.vote_average * 10) : "??";
      const releaseDate = item.release_date || item.first_air_date || "";

      let bars = "";
      for (let j = 0; j < 10; j++) {
        bars += `<span></span>`;
      }

      const html = `
        <div class="trending-item">
          ${poster ? `<img src="${poster}" alt="${title}">` : ""}
          <div class="rating-circle">${rating}%</div>
          <div class="trending-title">${title}</div>
          <div class="trending-date">${releaseDate}</div>
          <div class="equalizer">${bars}</div>
        </div>
      `;

      this.container.innerHTML += html;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Trending();
});
