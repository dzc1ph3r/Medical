import axios from "axios";
import type { MedicalRecord } from "../types/medicalRecord";

const API = "http://localhost:5000/api";

export const uploadMedicalRecord = (
  token: string,
  payload: { doctorId: string; notes?: string; file: File }
) => {
  const formData = new FormData();
  formData.append("doctorId", payload.doctorId);
  if (payload.notes) formData.append("notes", payload.notes);
  formData.append("file", payload.file);

  return axios.post<MedicalRecord>(`${API}/medical-records`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyMedicalRecords = (token: string) =>
  axios.get<MedicalRecord[]>(`${API}/medical-records/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDoctorMedicalRecords = (token: string) =>
  axios.get<MedicalRecord[]>(`${API}/medical-records/doctor/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
