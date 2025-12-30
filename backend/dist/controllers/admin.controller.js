"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctor = createDoctor;
exports.listUsers = listUsers;
exports.updateUser = updateUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
async function createDoctor(req, res) {
    try {
        const { name, email, password, specialty, city, consultationFee, gender } = req.body;
        if (!name || !email || !password || !specialty) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const exists = await User_1.default.findOne({ email: normalizedEmail });
        if (exists)
            return res.status(409).json({ message: "Email already used" });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const parsedFee = consultationFee !== undefined && consultationFee !== null
            ? Number(consultationFee)
            : undefined;
        const user = await User_1.default.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashed,
            role: "DOCTOR",
            specialty: String(specialty).trim(),
            consultationFee: parsedFee,
            gender: gender ?? undefined,
            city: city ? String(city).trim() : undefined,
        });
        const safeUser = await User_1.default.findById(user._id).select("-password");
        return res.status(201).json(safeUser);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function listUsers(req, res) {
    try {
        const users = await User_1.default.find().select("-password");
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, city, specialty, consultationFee, gender, role } = req.body;
        const user = await User_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (name !== undefined)
            user.name = String(name).trim();
        if (city !== undefined)
            user.city = String(city).trim();
        if (gender !== undefined)
            user.gender = gender;
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
        }
        else {
            user.specialty = undefined;
            user.consultationFee = undefined;
        }
        await user.save();
        const safeUser = await User_1.default.findById(user._id).select("-password");
        return res.json(safeUser);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
