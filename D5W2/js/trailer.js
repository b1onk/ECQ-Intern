import { API_KEY, BASE_URL, IMG_YOUTUBE } from "./config.js";

class TrailerCard {
  constructor(title, overview, youtubeKey) {
    this.title = title;
    this.overview = overview;
    this.youtubeKey = youtubeKey;
  }

  render() {
    return `
      <div class="trailer-card">
        <div class="thumbnail">
          <img src="${IMG_YOUTUBE}${this.youtubeKey}/hqdefault.jpg" />
          <a class="play-button" href="https://www.youtube.com/watch?v=${this.youtubeKey}" target="_blank">▶</a>
        </div>
        <h3>${this.title}</h3>
        <p>${this.overview}</p>
      </div>
    `;
  }
}

class TrailerList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async fetchTrailers() {
      const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
      const data = await res.json();
      const movies = data.results.slice(0, 6);

      const trailers = [];

      for (let movie of movies) {
        const res2 = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);
        const data2 = await res2.json();

        const trailer = data2.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          trailers.push(new TrailerCard(movie.title, movie.overview, trailer.key));
        }
      }

      return trailers;
    
  }

  async render() {
    const trailers = await this.fetchTrailers();
    if (trailers.length === 0) {
      this.container.innerHTML = "<p>Không có trailer nào để hiển thị.</p>";
      return;
    }

    this.container.innerHTML = trailers.map(t => t.render()).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const trailerList = new TrailerList("trailer-container");
  trailerList.render();
});
