"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    try {
        const { name, email, password, role, city, gender, consultationFee } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing fields" });
        }
        if (role && role !== "PATIENT") {
            return res.status(403).json({ message: "Only PATIENT registration is allowed" });
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
            role: "PATIENT",
            specialty: undefined,
            consultationFee: parsedFee, // Utilisation de parsedFee ici
            gender: gender ?? undefined,
            city: city ? String(city).trim() : undefined,
        });
        const token = (0, jwt_1.signToken)({ id: String(user._id), role: user.role });
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User_1.default.findOne({ email: normalizedEmail });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcrypt_1.default.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = (0, jwt_1.signToken)({ id: String(user._id), role: user.role });
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function me(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const user = await User_1.default.findById(req.user.id).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.json(user);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
