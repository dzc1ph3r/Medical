// src/types/appointment.ts

export type AppointmentStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

export type Appointment = {
  _id: string;
  date: string;
  status: AppointmentStatus;
  cancelReason?: string;
  patient: { _id: string; name: string; email: string; city?: string };
  doctor: string;
};
