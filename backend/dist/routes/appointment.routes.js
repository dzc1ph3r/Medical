"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
// Patient
router.post("/", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT"), appointment_controller_1.createAppointment);
router.get("/me", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT"), appointment_controller_1.getMyAppointments);
// Doctor (token-based)
router.get("/doctor/me", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("DOCTOR"), (req, res) => {
    req.params.doctorId = req.user.id;
    return (0, appointment_controller_1.getDoctorAppointments)(req, res);
});
router.patch("/:id/status", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("DOCTOR"), appointment_controller_1.updateAppointmentStatus);
router.patch("/:id/reschedule", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("DOCTOR"), appointment_controller_1.rescheduleAppointment);
exports.default = router;
