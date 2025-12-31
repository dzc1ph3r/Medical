import { apiClient } from "./client";
import type { MedicalRecord } from "../types/medicalRecord";

export const uploadMedicalRecord = (
  token: string,
  payload: { doctorId: string; notes?: string; file: File }
) => {
  const formData = new FormData();
  formData.append("doctorId", payload.doctorId);
  if (payload.notes) formData.append("notes", payload.notes);
  formData.append("file", payload.file);

  return apiClient.post<MedicalRecord>("/medical-records", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyMedicalRecords = (token: string) =>
  apiClient.get<MedicalRecord[]>("/medical-records/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDoctorMedicalRecords = (token: string) =>
  apiClient.get<MedicalRecord[]>("/medical-records/doctor/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMedicalRecordFile = async (token: string, id: string) => {
  const res = await apiClient.get(`/medical-records/${id}/file`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return res.data as Blob;
};

export const deleteMedicalRecord = (token: string, id: string) =>
  apiClient.delete(`/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
