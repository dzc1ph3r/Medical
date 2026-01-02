"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleAppointment = exports.updateAppointmentStatus = exports.getDoctorAppointments = exports.getMyAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const Notification_1 = __importDefault(require("../models/Notification"));
/**
 * PATIENT - Create appointment (PENDING)
 * POST /api/appointments
 * Body: { doctorId: string, date: string }
 */
const createAppointment = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        if (!doctorId || !date) {
            return res.status(400).json({ message: "doctorId and date are required" });
        }
        const when = new Date(date);
        if (isNaN(when.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        const appt = await Appointment_1.default.create({
            patient: req.user.id,
            doctor: doctorId,
            date: when,
            status: "PENDING",
        });
        await Notification_1.default.create({
            user: doctorId,
            message: "Nouveau rendez-vous en attente.",
            type: "APPOINTMENT_REQUEST",
        });
        const populated = await Appointment_1.default.findById(appt._id)
            .populate("patient", "name email city")
            .populate("doctor", "name specialty city");
        return res.status(201).json(populated);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.createAppointment = createAppointment;
/**
 * PATIENT - Get my appointments
 * GET /api/appointments/me
 */
const getMyAppointments = async (req, res) => {
    try {
        const appts = await Appointment_1.default.find({ patient: req.user.id })
            .populate("doctor", "name specialty city")
            .sort({ date: 1 });
        return res.json(appts);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.getMyAppointments = getMyAppointments;
/**
 * DOCTOR - Get doctor appointments (by param doctorId)
 * GET /api/appointments/doctor/:doctorId?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { from, to } = req.query;
        if (!doctorId) {
            return res.status(400).json({ message: "doctorId is required" });
        }
        const filter = { doctor: doctorId };
        if (from || to) {
            filter.date = {};
            if (from)
                filter.date.$gte = new Date(String(from));
            if (to)
                filter.date.$lte = new Date(String(to));
        }
        const appts = await Appointment_1.default.find(filter)
            .populate("patient", "name email city")
            .sort({ date: 1 });
        return res.json(appts);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.getDoctorAppointments = getDoctorAppointments;
/**
 * DOCTOR - Update appointment status
 * PATCH /api/appointments/:id/status
 * Body: { status: "PENDING" | "ACCEPTED" | "CANCELLED", cancelReason?: string }
 */
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancelReason } = req.body;
        if (!["PENDING", "ACCEPTED", "CANCELLED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const appt = await Appointment_1.default.findById(id);
        if (!appt)
            return res.status(404).json({ message: "Appointment not found" });
        // ✅ Security: only the doctor who owns the appointment can update it
        if (String(appt.doctor) !== req.user.id) {
            return res.status(403).json({ message: "Not your appointment" });
        }
        appt.status = status;
        appt.cancelReason = status === "CANCELLED" ? (cancelReason || "") : undefined;
        await appt.save();
        await Notification_1.default.create({
            user: appt.patient,
            message: status === "ACCEPTED"
                ? "Votre rendez-vous a été accepté."
                : status === "CANCELLED"
                    ? "Votre rendez-vous a été annulé."
                    : "Votre rendez-vous a été mis à jour.",
            type: "APPOINTMENT_STATUS",
        });
        const populated = await Appointment_1.default.findById(appt._id)
            .populate("patient", "name email city")
            .populate("doctor", "name specialty city");
        return res.json(populated);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
/**
 * DOCTOR - Reschedule appointment (and reset to PENDING)
 * PATCH /api/appointments/:id/reschedule
 * Body: { date: string }
 */
const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;
        const newDate = new Date(date);
        if (isNaN(newDate.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        const appt = await Appointment_1.default.findById(id);
        if (!appt)
            return res.status(404).json({ message: "Appointment not found" });
        // ✅ Security: only the doctor who owns the appointment can reschedule it
        if (String(appt.doctor) !== req.user.id) {
            return res.status(403).json({ message: "Not your appointment" });
        }
        appt.date = newDate;
        appt.status = "PENDING";
        appt.cancelReason = undefined;
        await appt.save();
        await Notification_1.default.create({
            user: appt.patient,
            message: "Votre rendez-vous a été reporté. Merci de confirmer la nouvelle date.",
            type: "APPOINTMENT_RESCHEDULED",
        });
        const populated = await Appointment_1.default.findById(appt._id)
            .populate("patient", "name email city")
            .populate("doctor", "name specialty city");
        return res.json(populated);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.rescheduleAppointment = rescheduleAppointment;
