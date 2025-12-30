// src/types/appointment.ts

export type AppointmentStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

export type PersonRef = {
  _id: string;
  name: string;
  email?: string;
  specialty?: string;
  city?: string;
};

export type Appointment = {
  _id: string;
  date: string;
  status: AppointmentStatus;
  cancelReason?: string;
  patient: string | PersonRef;
  doctor: string | PersonRef;
};
