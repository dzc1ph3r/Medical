import { Request, Response } from "express";
import Notification from "../models/Notification";

/**
 * PATIENT - Get my notifications
 * GET /api/notifications/me
 */
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user!.id }).sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};
