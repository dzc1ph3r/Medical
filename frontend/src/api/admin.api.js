import axios from "axios";
const API = "http://localhost:5000/api";
export const getUsers = (token) => axios.get(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updateUser = (token, id, payload) => axios.patch(`${API}/admin/users/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});
export const createDoctor = (token, payload) => axios.post(`${API}/admin/doctors`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});
