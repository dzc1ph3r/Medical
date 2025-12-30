"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const { specialty, city } = req.query;
        const filters = { role: "DOCTOR" };
        if (specialty)
            filters.specialty = String(specialty);
        if (city)
            filters.city = String(city);
        const doctors = await User_1.default.find(filters);
        return res.json(doctors);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User_1.default.findOne({ _id: id, role: "DOCTOR" });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.json(doctor);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
});
exports.default = router;
