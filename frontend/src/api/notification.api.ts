import axios from "axios";
import type { Notification } from "../types/notification";

const API = import.meta.env.VITE_API_URL || "https://medical-1-xoci.onrender.com/api";

export const getMyNotifications = (token: string) =>
  axios.get<Notification[]>(`${API}/notifications/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
