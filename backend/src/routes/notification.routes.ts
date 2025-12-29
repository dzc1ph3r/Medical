import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { getMyNotifications } from "../controllers/notification.controller";

const router = Router();

router.get("/me", auth, requireRole("PATIENT"), getMyNotifications);

export default router;
