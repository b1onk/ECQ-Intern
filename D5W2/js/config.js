
export const API_KEY = "d2cc0a1f0484d667dbbc1e35e9ce34ed";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p/w200";
export const IMG_YOUTUBE = "https://img.youtube.com/vi/";

export const ENDPOINTS = {

  token: `https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`,
  validateLogin: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${API_KEY}`,
  createSession: `https://api.themoviedb.org/3/authentication/session/new?api_key=${API_KEY}`,


  searchFilmURL: `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`,
  searchALL: `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}`,

  getAccount: (session_id) =>
    `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${session_id}`,


  trending: (mediaType = "all", timeWindow = "day") =>
    `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`,


  getAccount: (session_id) =>
    `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${session_id}`,
};
