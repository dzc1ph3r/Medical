import axios from "axios";

const API = "http://localhost:5000/api";

export const getMyNotifications = (token: string) =>
  axios.get(`${API}/notifications/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationRead = (token: string, id: string) =>
  axios.patch(
    `${API}/notifications/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
