"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedicalRecord = uploadMedicalRecord;
exports.getMyMedicalRecords = getMyMedicalRecords;
exports.getDoctorMedicalRecords = getDoctorMedicalRecords;
exports.getMedicalRecordFile = getMedicalRecordFile;
exports.deleteMedicalRecord = deleteMedicalRecord;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const MedicalRecord_1 = __importDefault(require("../models/MedicalRecord"));
const buildFileUrl = (id) => `/api/medical-records/${id}/file`;
async function uploadMedicalRecord(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { doctorId, notes } = req.body;
        const file = req.file;
        if (!doctorId || !file) {
            return res.status(400).json({ message: "doctorId and file are required" });
        }
        const record = await MedicalRecord_1.default.create({
            patient: req.user.id,
            doctor: doctorId,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            notes: notes ? String(notes) : undefined,
        });
        const populated = await MedicalRecord_1.default.findById(record._id)
            .populate("patient", "name email city")
            .populate("doctor", "name specialty city");
        if (!populated)
            return res.status(201).json(record);
        return res.status(201).json({
            ...populated.toObject(),
            fileUrl: buildFileUrl(String(populated._id)),
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function getMyMedicalRecords(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const records = await MedicalRecord_1.default.find({ patient: req.user.id })
            .populate("doctor", "name specialty city")
            .sort({ createdAt: -1 });
        return res.json(records.map((record) => ({
            ...record.toObject(),
            fileUrl: buildFileUrl(String(record._id)),
        })));
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function getDoctorMedicalRecords(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const records = await MedicalRecord_1.default.find({ doctor: req.user.id })
            .populate("patient", "name email city")
            .sort({ createdAt: -1 });
        return res.json(records.map((record) => ({
            ...record.toObject(),
            fileUrl: buildFileUrl(String(record._id)),
        })));
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function getMedicalRecordFile(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;
        const record = await MedicalRecord_1.default.findById(id);
        if (!record)
            return res.status(404).json({ message: "Document not found" });
        const isOwner = String(record.patient) === req.user.id || String(record.doctor) === req.user.id;
        if (!isOwner && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const filePath = path_1.default.join(process.cwd(), "uploads", record.fileName);
        return res.sendFile(filePath);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function deleteMedicalRecord(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;
        const record = await MedicalRecord_1.default.findById(id);
        if (!record)
            return res.status(404).json({ message: "Document not found" });
        const isOwner = String(record.patient) === req.user.id || String(record.doctor) === req.user.id;
        if (!isOwner && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const filePath = path_1.default.join(process.cwd(), "uploads", record.fileName);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await record.deleteOne();
        return res.json({ message: "Document deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
