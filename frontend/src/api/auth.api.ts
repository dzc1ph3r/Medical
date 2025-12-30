import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://medical-1-xoci.onrender.com/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  city?: string;
  gender?: "MALE" | "FEMALE";
};

export const login = (payload: LoginPayload) =>
  axios.post(`${API}/auth/login`, payload);

export const register = (payload: RegisterPayload) =>
  axios.post(`${API}/auth/register`, payload);

export const me = (token: string) =>
  axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
