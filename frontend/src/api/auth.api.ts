import axios from "axios";

const API = "http://localhost:5000/api";

export const login = (email: string, password: string) =>
  axios.post(`${API}/auth/login`, { email, password });

export const register = (payload: any) =>
  axios.post(`${API}/auth/register`, payload);

export const me = (token: string) =>
  axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
