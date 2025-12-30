import axios from "axios";
const API = "http://localhost:5000/api";
export const getMyNotifications = (token) => axios.get(`${API}/notifications/me`, {
    headers: { Authorization: `Bearer ${token}` },
});
