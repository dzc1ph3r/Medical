import { Router } from "express";
import multer from "multer";
import path from "path";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  uploadMedicalRecord,
  getMyMedicalRecords,
  getDoctorMedicalRecords,
  getMedicalRecordFile,
  deleteMedicalRecord,
} from "../controllers/medicalRecord.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const isVercel = process.env.VERCEL === "1";
    const uploadDir = isVercel ? "/tmp/uploads" : path.join(process.cwd(), "uploads");

    // Ensure dir exists before upload (multer might not create it automatically)
    const fs = require('fs'); // Dynamic require if needed, but imported above usually
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post("/", auth, requireRole("PATIENT"), upload.single("file"), uploadMedicalRecord);
router.get("/me", auth, requireRole("PATIENT"), getMyMedicalRecords);
router.get("/doctor/me", auth, requireRole("DOCTOR"), getDoctorMedicalRecords);
router.get("/:id/file", auth, requireRole("PATIENT", "DOCTOR", "ADMIN"), getMedicalRecordFile);
router.delete("/:id", auth, requireRole("PATIENT", "DOCTOR", "ADMIN"), deleteMedicalRecord);

export default router;
