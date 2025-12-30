import axios from "axios";
import type { User } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export type AdminUserUpdate = Partial<User> & { role?: "PATIENT" | "DOCTOR" | "ADMIN" };

export const getUsers = (token: string) =>
  axios.get<User[]>(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (token: string, id: string, payload: AdminUserUpdate) =>
  axios.patch<User>(`${API}/admin/users/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createDoctor = (
  token: string,
  payload: {
    name: string;
    email: string;
    password: string;
    specialty: string;
    city?: string;
    consultationFee?: number;
    gender?: "MALE" | "FEMALE";
  }
) =>
  axios.post<User>(`${API}/admin/doctors`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
