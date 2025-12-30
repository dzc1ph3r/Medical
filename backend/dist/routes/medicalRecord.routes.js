"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const medicalRecord_controller_1 = require("../controllers/medicalRecord.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path_1.default.join(process.cwd(), "uploads"));
    },
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
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
router.post("/", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT"), upload.single("file"), medicalRecord_controller_1.uploadMedicalRecord);
router.get("/me", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT"), medicalRecord_controller_1.getMyMedicalRecords);
router.get("/doctor/me", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("DOCTOR"), medicalRecord_controller_1.getDoctorMedicalRecords);
router.get("/:id/file", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT", "DOCTOR", "ADMIN"), medicalRecord_controller_1.getMedicalRecordFile);
router.delete("/:id", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT", "DOCTOR", "ADMIN"), medicalRecord_controller_1.deleteMedicalRecord);
exports.default = router;
