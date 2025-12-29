import { Request, Response } from "express";
import User from "../models/User";

type Role = "DOCTOR" | "PATIENT";

export async function updateMe(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, city, specialty, consultationFee } = req.body as {
      name?: string;
      city?: string;
      specialty?: string;
      consultationFee?: number;
    };

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = String(name).trim();
    if (city !== undefined) user.city = String(city).trim();

    if (user.role === "DOCTOR") {
      if (specialty !== undefined) {
        const nextSpecialty = String(specialty).trim();
        if (!nextSpecialty) {
          return res.status(400).json({ message: "specialty is required for DOCTOR" });
        }
        user.specialty = nextSpecialty;
      }
      if (consultationFee !== undefined) {
        const parsedFee = Number(consultationFee);
        if (Number.isNaN(parsedFee) || parsedFee < 0) {
          return res.status(400).json({ message: "consultationFee must be a positive number" });
        }
        user.consultationFee = parsedFee;
      }
    } else {
      user.specialty = undefined;
      user.consultationFee = undefined;
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    return res.json(safeUser);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
