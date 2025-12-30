import axios from "axios";
const API = "http://localhost:5000/api";
export const updateMe = (token, payload) => axios.patch(`${API}/users/me`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updatePassword = (token, payload) => axios.patch(`${API}/users/me/password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});
