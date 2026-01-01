import axios from "axios";

const API_BASE_URL_FALLBACK = import.meta.env.DEV
  ? "/api"
  : "https://medcare-silk.vercel.app/api";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? API_BASE_URL_FALLBACK;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
