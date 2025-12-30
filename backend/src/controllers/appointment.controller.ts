import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import Notification from "../models/Notification";

/**
 * PATIENT - Create appointment (PENDING)
 * POST /api/appointments
 * Body: { doctorId: string, date: string }
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, date } = req.body as { doctorId: string; date: string };

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }

    const when = new Date(date);
    if (isNaN(when.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const appt = await Appointment.create({
      patient: req.user!.id,
      doctor: doctorId,
      date: when,
      status: "PENDING",
    });

    const populated = await Appointment.findById(appt._id)
      .populate("patient", "name email city")
      .populate("doctor", "name specialty city");

    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * PATIENT - Get my appointments
 * GET /api/appointments/me
 */
export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const appts = await Appointment.find({ patient: req.user!.id })
      .populate("doctor", "name specialty city")
      .sort({ date: 1 });

    return res.json(appts);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * DOCTOR - Get doctor appointments (by param doctorId)
 * GET /api/appointments/doctor/:doctorId?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { from, to } = req.query;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const filter: any = { doctor: doctorId };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(String(from));
      if (to) filter.date.$lte = new Date(String(to));
    }

    const appts = await Appointment.find(filter)
      .populate("patient", "name email city")
      .sort({ date: 1 });

    return res.json(appts);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * DOCTOR - Update appointment status
 * PATCH /api/appointments/:id/status
 * Body: { status: "PENDING" | "ACCEPTED" | "CANCELLED", cancelReason?: string }
 */
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body as {
      status: "PENDING" | "ACCEPTED" | "CANCELLED";
      cancelReason?: string;
    };

    if (!["PENDING", "ACCEPTED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // ✅ Security: only the doctor who owns the appointment can update it
    if (String(appt.doctor) !== req.user!.id) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    appt.status = status;
    appt.cancelReason = status === "CANCELLED" ? (cancelReason || "") : undefined;

    await appt.save();

    const statusLabel =
      status === "ACCEPTED"
        ? "accepté"
        : status === "CANCELLED"
          ? "annulé"
          : "mis à jour";
    let message = `Votre rendez-vous a été ${statusLabel}.`;
    if (status === "CANCELLED" && cancelReason) {
      message = `${message} Motif : ${cancelReason}.`;
    }

    await Notification.create({
      user: appt.patient,
      appointment: appt._id,
      message,
    });

    const populated = await Appointment.findById(appt._id)
      .populate("patient", "name email city")
      .populate("doctor", "name specialty city");

    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * DOCTOR - Reschedule appointment (and reset to PENDING)
 * PATCH /api/appointments/:id/reschedule
 * Body: { date: string }
 */
export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.body as { date: string };

    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // ✅ Security: only the doctor who owns the appointment can reschedule it
    if (String(appt.doctor) !== req.user!.id) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    appt.date = newDate;
    appt.status = "PENDING";
    appt.cancelReason = undefined;

    await appt.save();

    const formattedDate = newDate.toLocaleString("fr-FR");
    await Notification.create({
      user: appt.patient,
      appointment: appt._id,
      message: `Votre rendez-vous a été replanifié au ${formattedDate}.`,
    });

    const populated = await Appointment.findById(appt._id)
      .populate("patient", "name email city")
      .populate("doctor", "name specialty city");

    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};
