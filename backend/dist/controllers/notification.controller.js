"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyNotifications = getMyNotifications;
exports.markNotificationRead = markNotificationRead;
const Notification_1 = __importDefault(require("../models/Notification"));
async function getMyNotifications(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const notifications = await Notification_1.default.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        return res.json(notifications);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
async function markNotificationRead(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;
        const notification = await Notification_1.default.findOneAndUpdate({ _id: id, user: req.user.id }, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.json(notification);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: String(err) });
    }
}
