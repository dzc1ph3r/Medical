import axios from "axios";
import type { User } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "https://medical-1-xoci.onrender.com/api";

export const updateMe = (token: string, payload: Partial<User>) =>
  axios.patch<User>(`${API}/users/me`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePassword = (
  token: string,
  payload: { currentPassword: string; newPassword: string }
) =>
  axios.patch(`${API}/users/me/password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
