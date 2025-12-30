import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { getMyNotifications, markNotificationRead } from "../controllers/notification.controller";

const router = Router();

router.get("/me", auth, getMyNotifications);
router.patch("/:id/read", auth, markNotificationRead);

export default router;
