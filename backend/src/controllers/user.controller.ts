import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

type Role = "DOCTOR" | "PATIENT";

export async function updateMe(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, city, specialty, consultationFee, gender } = req.body as {
      name?: string;
      city?: string;
      specialty?: string;
      consultationFee?: number;
      gender?: "MALE" | "FEMALE";
    };

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = String(name).trim();
    if (city !== undefined) user.city = String(city).trim();
    if (gender !== undefined) user.gender = gender;

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

export async function updatePassword(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
