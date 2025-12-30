export type MedicalRecord = {
  _id: string;
  fileUrl?: string;
  fileName?: string;
  originalName: string;
  mimeType: string;
  notes?: string;
  createdAt: string;
  doctor?: { _id: string; name: string; specialty?: string; city?: string };
  patient?: { _id: string; name: string; email?: string };
};
