import { Request, Response } from "express";
import path from "path";
import MedicalRecord from "../models/MedicalRecord";

const buildFileUrl = (id: string) => `/api/medical-records/${id}/file`;

export async function uploadMedicalRecord(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { doctorId, notes } = req.body as { doctorId?: string; notes?: string };
    const file = req.file;

    if (!doctorId || !file) {
      return res.status(400).json({ message: "doctorId and file are required" });
    }

    const record = await MedicalRecord.create({
      patient: req.user.id,
      doctor: doctorId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      notes: notes ? String(notes) : undefined,
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate("patient", "name email city")
      .populate("doctor", "name specialty city");

    if (!populated) return res.status(201).json(record);

    return res.status(201).json({
      ...populated.toObject(),
      fileUrl: buildFileUrl(String(populated._id)),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function getMyMedicalRecords(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const records = await MedicalRecord.find({ patient: req.user.id })
      .populate("doctor", "name specialty city")
      .sort({ createdAt: -1 });

    return res.json(
      records.map((record) => ({
        ...record.toObject(),
        fileUrl: buildFileUrl(String(record._id)),
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function getDoctorMedicalRecords(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const records = await MedicalRecord.find({ doctor: req.user.id })
      .populate("patient", "name email city")
      .sort({ createdAt: -1 });

    return res.json(
      records.map((record) => ({
        ...record.toObject(),
        fileUrl: buildFileUrl(String(record._id)),
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function getMedicalRecordFile(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const record = await MedicalRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Document not found" });

    const isOwner =
      String(record.patient) === req.user.id || String(record.doctor) === req.user.id;
    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const filePath = path.join(process.cwd(), "uploads", record.fileName);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
