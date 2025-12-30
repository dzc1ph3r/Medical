import axios from "axios";
import type { MedicalRecord } from "../types/medicalRecord";

const API = import.meta.env.VITE_API_URL || "https://medical-1-xoci.onrender.com/api";

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

export const getMedicalRecordFile = async (token: string, id: string) => {
  const res = await axios.get(`${API}/medical-records/${id}/file`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return res.data as Blob;
};

export const deleteMedicalRecord = (token: string, id: string) =>
  axios.delete(`${API}/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
