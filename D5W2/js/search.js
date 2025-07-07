import { API_KEY, ENDPOINTS } from "./config.js";

const searchInput = document.querySelector("#search");
const suggestionsList = document.querySelector("#search-suggestions");

// debounce để giới hạn gọi API
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

class Search {
  async searchAll(query) {
    if (!query) {
      suggestionsList.innerHTML = "";
      return;
    }

    const url = ENDPOINTS.searchALL + "&query=" + encodeURIComponent(query);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        suggestionsList.innerHTML = "<li>Không có kết quả.</li>";
        return;
      }

      this.renderDropdown(data.results.slice(0, 100)); 
    } catch (err) {
      console.error("Lỗi:", err);
      suggestionsList.innerHTML = "<li>Lỗi khi tìm kiếm</li>";
    }
  }

  renderDropdown(results) {
    suggestionsList.innerHTML = ""; 

    results.forEach(item => {
      const name = item.title || item.name || "Không rõ";
      const mediaType = item.media_type || "unknown";


      let icon = "🔍";
      if (mediaType === "movie") icon = "🎬";
      else if (mediaType === "tv") icon = "📺";
      else if (mediaType === "person") icon = "🧑";

      const li = document.createElement("li");
      li.innerHTML = `<i>${icon}</i> ${name}`;
      suggestionsList.appendChild(li);
    });
  }
}

const search = new Search();

const handleSearch = debounce(() => {
  const keyword = searchInput.value.trim();
  search.searchAll(keyword);
}, 400);

searchInput.addEventListener("input", handleSearch);


document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
    suggestionsList.innerHTML = "";
  }
});
