import { apiClient } from "./client";
import type { User } from "../context/AuthContext";

export const updateMe = (token: string, payload: Partial<User>) =>
  apiClient.patch<User>("/users/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePassword = (
  token: string,
  payload: { currentPassword: string; newPassword: string }
) =>
  apiClient.patch("/users/me/password", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
