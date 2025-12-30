import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointment.routes";
import doctorRoutes from "./routes/doctor.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.chmodSync(dir, 0o700);
  }
  return dir;
};

ensureUploadsDir();

const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.chmodSync(dir, 0o700);
  }
  return dir;
};

ensureUploadsDir();

const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.chmodSync(dir, 0o700);
  }
  return dir;
};

ensureUploadsDir();

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
