import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email";
import User from "../models/User";
import { signToken } from "../utils/jwt";
import crypto from "crypto";

type Role = "DOCTOR" | "PATIENT" | "ADMIN";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role, city, gender } = req.body as {
      name: string;
      email: string;
      password: string;
      role: Role;
      city?: string;
      gender?: "MALE" | "FEMALE";
    };

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (role && role !== "PATIENT") {
      return res.status(403).json({ message: "Only PATIENT registration is allowed" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role: "PATIENT",
      specialty: undefined,
      consultationFee: undefined,
      gender: gender ?? undefined,
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

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email
    const frontendUrl = process.env.FRONTEND_URL || "https://medcare-silk.vercel.app";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    const message = `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé une réinitialisation de mot de passe.</p>
      <p>Veuillez cliquer sur le lien suivant pour définir un nouveau mot de passe :</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Ce lien expirera dans 1 heure.</p>
    `;

    try {
      await sendEmail(user.email, "Réinitialisation de mot de passe - MediConnect", message);
      return res.json({ message: "Un email de réinitialisation a été envoyé." });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
}
