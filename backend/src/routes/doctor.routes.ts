import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { specialty, wilaya, city } = req.query;
    const filters: Record<string, unknown> = { role: "DOCTOR" };

    const buildRegex = (value: string) =>
      new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    if (typeof specialty === "string" && specialty.trim()) {
      filters.specialty = buildRegex(specialty.trim());
    }

    if (typeof wilaya === "string" && wilaya.trim()) {
      filters.wilaya = buildRegex(wilaya.trim());
    }

    if (typeof city === "string" && city.trim()) {
      filters.city = buildRegex(city.trim());
    }

    const doctors = await User.find(filters);
    return res.json(doctors);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await User.findOne({ _id: id, role: "DOCTOR" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json(doctor);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

export default router;
