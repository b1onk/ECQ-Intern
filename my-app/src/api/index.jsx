import axios from "axios";

export const API_KEY = "d2cc0a1f0484d667dbbc1e35e9ce34ed";
export const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w200";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
export const IMG_YOUTUBE = "https://img.youtube.com/vi/";


// Token & Auth
export const getToken = async () => {
  const res = await axios.get(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
  return res.data;
};

export const validateLogin = async ({ username, password, request_token }) => {
  const res = await axios.post(
    `${BASE_URL}/authentication/token/validate_with_login?api_key=${API_KEY}`,
    {
      username,
      password,
      request_token,
    }
  );
  return res.data;
};

export const createSession = async (request_token) => {
  const res = await axios.post(
    `${BASE_URL}/authentication/session/new?api_key=${API_KEY}`,
    { request_token }
  );
  return res.data;
};

export const getAccount = async (session_id) => {
  const res = await axios.get(
    `${BASE_URL}/account?api_key=${API_KEY}&session_id=${session_id}`
  );
  return res.data;
};

//  Trending & Popular
export const fetchTrending = async (mediaType = "movie", timeWindow = "week") => {
  const res = await axios.get(`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchMovieDetail = async (id) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.data;
};

//  Search
export const searchMovies = async (query) => {
  const res = await axios.get(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return res.data.results;
};

export const searchAll = async (query) => {
  const res = await axios.get(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return res.data.results;
};

// Latest Trailers (custom API to get trailers)
export const fetchLatestTrailers = async () => {
  const res = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  const movies = res.data.results;

  // Lấy video trailer đầu tiên của từng phim
  const trailers = await Promise.all(
    movies.slice(0, 10).map(async (movie) => {
      const videoRes = await axios.get(
        `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
      );

      const trailer = videoRes.data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        trailer_key: trailer ? trailer.key : null,
      };
    })
  );

  // Chỉ giữ lại phim có trailer YouTube
  return trailers.filter((t) => t.trailer_key);
};


export const fetchPopularTVShows = async () => {
  const res = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchPopularPeople = async (page = 1) => {
  const res = await axios.get(`${BASE_URL}/person/popular?api_key=${API_KEY}&page=${page}`);
  return res.data;
};

export async function fetchUpcomingMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch upcoming movies");
  return res.json();
}