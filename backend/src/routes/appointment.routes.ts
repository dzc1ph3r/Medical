import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
} from "../controllers/appointment.controller";

const router = Router();

// Patient
router.post("/", auth, requireRole("PATIENT"), createAppointment);
router.get("/me", auth, requireRole("PATIENT"), getMyAppointments);

// Doctor (token-based)
router.get("/doctor/me", auth, requireRole("DOCTOR"), (req, res) => {
  (req as any).params.doctorId = req.user!.id;
  return getDoctorAppointments(req as any, res as any);
});

router.patch("/:id/status", auth, requireRole("DOCTOR"), updateAppointmentStatus);
router.patch("/:id/reschedule", auth, requireRole("DOCTOR"), rescheduleAppointment);

export default router;
