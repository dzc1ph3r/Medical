import axios from "axios";
import type { User } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export const updateMe = (token: string, payload: Partial<User>) =>
  axios.patch<User>(`${API}/users/me`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
