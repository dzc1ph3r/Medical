import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createMedicalRecord } from "../controllers/medicalRecord.controller";

const uploadDir = path.join(process.cwd(), "uploads", "medical-records");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({ storage });

const router = Router();

router.post(
  "/",
  auth,
  requireRole("PATIENT", "DOCTOR"),
  upload.single("file"),
  createMedicalRecord
);

export default router;
