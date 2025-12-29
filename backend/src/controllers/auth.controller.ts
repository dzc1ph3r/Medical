import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { signToken } from "../utils/jwt";

type Role = "DOCTOR" | "PATIENT";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role, specialty, city } = req.body as {
      name: string;
      email: string;
      password: string;
      role: Role;
      specialty?: string;
      city?: string;
    };

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (role !== "DOCTOR" && role !== "PATIENT") {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "DOCTOR" && !specialty) {
      return res.status(400).json({ message: "specialty is required for DOCTOR" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role,
      specialty: role === "DOCTOR" ? String(specialty) : undefined,
      city: city ? String(city).trim() : undefined,
    });

    const token = signToken({ id: String(user._id), role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: String(user._id), role: user.role });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
