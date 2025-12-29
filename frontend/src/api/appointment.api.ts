import axios from "axios";
import type { Appointment } from "../types/appointment"; // Import du type depuis le fichier types/appointment.ts

const API = "http://localhost:5000/api";

// Définition du type AppointmentStatus
export type AppointmentStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

// N'exporte pas à nouveau le type Appointment ici car il est déjà importé depuis types/appointment.ts

// Exports des fonctions API
export const getMyDoctorAppointments = (token: string) =>
  axios.get<Appointment[]>(`${API}/appointments/doctor/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyAppointments = (token: string) =>
  axios.get<Appointment[]>(`${API}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAppointmentStatus = (
  token: string,
  id: string,
  status: AppointmentStatus,
  cancelReason?: string
) =>
  axios.patch<Appointment>(
    `${API}/appointments/${id}/status`,
    { status, cancelReason },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const rescheduleAppointment = (token: string, id: string, date: string) =>
  axios.patch<Appointment>(
    `${API}/appointments/${id}/reschedule`,
    { date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
