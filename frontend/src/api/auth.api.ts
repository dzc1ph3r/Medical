import { apiClient } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  city?: string;
  gender?: "MALE" | "FEMALE";
};

export const login = (payload: LoginPayload) =>
  apiClient.post("/auth/login", payload);

export const register = (payload: RegisterPayload) =>
  apiClient.post("/auth/register", payload);

export const me = (token: string) =>
  apiClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
