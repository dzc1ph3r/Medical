import axios from "axios";
import { RegisterPayload, LoginPayload } from "../types/auth";

const API = import.meta.env.VITE_API_URL || "https://medical-1-xoci.onrender.com/api";

export const login = (payload: LoginPayload) =>
  axios.post(`${API}/auth/login`, payload);

export const register = (payload: RegisterPayload) =>
  axios.post(`${API}/auth/register`, payload);

export const me = (token: string) =>
  axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
