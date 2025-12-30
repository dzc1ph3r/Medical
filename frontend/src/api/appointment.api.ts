import { apiClient } from "./client";
import type { Appointment } from "../types/appointment"; // Import du type depuis le fichier types/appointment.ts

// Définition du type AppointmentStatus
export type AppointmentStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

// N'exporte pas à nouveau le type Appointment ici car il est déjà importé depuis types/appointment.ts

// Exports des fonctions API
export const getMyDoctorAppointments = (token: string) =>
  apiClient.get<Appointment[]>("/appointments/doctor/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyAppointments = (token: string) =>
  apiClient.get<Appointment[]>("/appointments/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createAppointment = (
  token: string,
  payload: { doctorId: string; date: string }
) =>
  apiClient.post<Appointment>("/appointments", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAppointmentStatus = (
  token: string,
  id: string,
  status: AppointmentStatus,
  cancelReason?: string
) =>
  apiClient.patch<Appointment>(
    `/appointments/${id}/status`,
    { status, cancelReason },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const rescheduleAppointment = (token: string, id: string, date: string) =>
  apiClient.patch<Appointment>(
    `/appointments/${id}/reschedule`,
    { date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
