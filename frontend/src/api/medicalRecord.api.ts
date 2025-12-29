import axios from "axios";
import type { MedicalRecord } from "../types/medicalRecord";

const API = "http://localhost:5000/api";

export const getDoctorMedicalRecords = (token: string) =>
  axios.get<MedicalRecord[]>(`${API}/medical-records/doctor/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
