import { apiClient } from "./client";

export const getMyNotifications = (token: string) =>
  apiClient.get("/notifications/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationRead = (token: string, id: string) =>
  apiClient.patch(
    `/notifications/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
