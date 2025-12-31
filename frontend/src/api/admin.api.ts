import { apiClient } from "./client";
import type { User } from "../context/AuthContext";

export type AdminUserUpdate = Partial<User> & { role?: "PATIENT" | "DOCTOR" | "ADMIN" };

export const getUsers = (token: string) =>
  apiClient.get<User[]>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (token: string, id: string, payload: AdminUserUpdate) =>
  apiClient.patch<User>(`/admin/users/${id}`, payload, {
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
  apiClient.post<User>("/admin/doctors", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
