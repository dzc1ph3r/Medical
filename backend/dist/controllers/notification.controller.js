"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
/**
 * PATIENT - Get my notifications
 * GET /api/notifications/me
 */
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification_1.default.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.json(notifications);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.getMyNotifications = getMyNotifications;
