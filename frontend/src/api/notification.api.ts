import axios from "axios";
import type { Notification } from "../types/notification";

const API = "http://localhost:5000/api";

export const getMyNotifications = (token: string) =>
  axios.get<Notification[]>(`${API}/notifications/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
