import type { PersonRef } from "./appointment";

export type MedicalRecordFile = {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
};

export type MedicalRecord = {
  _id: string;
  patient: string | PersonRef;
  doctor: string | PersonRef;
  diagnosis?: string;
  notes?: string;
  file: MedicalRecordFile;
  createdAt: string;
  updatedAt: string;
};
