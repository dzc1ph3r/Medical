import { Request, Response } from "express";
import MedicalRecord from "../models/MedicalRecord";

type MulterFile = Express.Multer.File | undefined;

const resolvePatientAndDoctor = (req: Request) => {
  const { doctorId, patientId } = req.body as { doctorId?: string; patientId?: string };

  if (req.user?.role === "PATIENT") {
    return { patient: req.user.id, doctor: doctorId };
  }

  if (req.user?.role === "DOCTOR") {
    return { patient: patientId, doctor: req.user.id };
  }

  return { patient: undefined, doctor: undefined };
};

export async function createMedicalRecord(req: Request, res: Response) {
  try {
    const file = req.file as MulterFile;
    const { diagnosis, notes } = req.body as { diagnosis?: string; notes?: string };
    const { patient, doctor } = resolvePatientAndDoctor(req);

    if (!patient || !doctor) {
      return res.status(400).json({ message: "patientId and doctorId are required" });
    }

    if (!file) {
      return res.status(400).json({ message: "File upload is required" });
    }

    const record = await MedicalRecord.create({
      patient,
      doctor,
      diagnosis,
      notes,
      file: {
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path
      }
    });

    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create medical record" });
  }
}

export async function getDoctorMedicalRecords(req: Request, res: Response) {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await MedicalRecord.find({ doctor: doctorId })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load medical records" });
  }
}
