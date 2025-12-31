import { apiClient } from "./client";

type DoctorFilters = {
  specialty?: string;
  wilaya?: string;
  city?: string;
};

export const getDoctors = async (filters: DoctorFilters) => {
  return apiClient.get("/doctors", { params: filters });
};

export const getDoctorById = async (id: string) => {
  return apiClient.get(`/doctors/${id}`);
};
