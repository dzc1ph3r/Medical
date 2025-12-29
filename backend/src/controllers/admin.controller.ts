import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export async function createDoctor(req: Request, res: Response) {
  try {
    const { name, email, password, specialty, city, consultationFee, gender } = req.body as {
      name: string;
      email: string;
      password: string;
      specialty: string;
      city?: string;
      consultationFee?: number;
      gender?: "MALE" | "FEMALE";
    };

    if (!name || !email || !password || !specialty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const parsedFee =
      consultationFee !== undefined && consultationFee !== null
        ? Number(consultationFee)
        : undefined;

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role: "DOCTOR",
      specialty: String(specialty).trim(),
      consultationFee: parsedFee,
      gender: gender ?? undefined,
      city: city ? String(city).trim() : undefined,
    });

    const safeUser = await User.findById(user._id).select("-password");
    return res.status(201).json(safeUser);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, city, specialty, consultationFee, gender, role } = req.body as {
      name?: string;
      city?: string;
      specialty?: string;
      consultationFee?: number;
      gender?: "MALE" | "FEMALE";
      role?: Role;
    };

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = String(name).trim();
    if (city !== undefined) user.city = String(city).trim();
    if (gender !== undefined) user.gender = gender;

    if (role !== undefined) {
      if (!["PATIENT", "DOCTOR", "ADMIN"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      user.role = role;
    }

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
