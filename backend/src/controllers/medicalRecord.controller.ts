import { Request, Response } from "express";
import MedicalRecord from "../models/MedicalRecord";

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
      fileUrl: `/uploads/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      notes: notes ? String(notes) : undefined,
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate("patient", "name email city")
      .populate("doctor", "name specialty city");

    return res.status(201).json(populated);
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

    return res.json(records);
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

    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
