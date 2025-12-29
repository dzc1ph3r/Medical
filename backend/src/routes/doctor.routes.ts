import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const { specialty, city } = req.query;
  const doctors = await User.find({
    role: "DOCTOR",
    specialty,
    city
  });
  res.json(doctors);
});

export default router;
