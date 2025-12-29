import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createDoctor, listUsers, updateUser } from "../controllers/admin.controller";

const router = Router();

router.get("/users", auth, requireRole("ADMIN"), listUsers);
router.patch("/users/:id", auth, requireRole("ADMIN"), updateUser);
router.post("/doctors", auth, requireRole("ADMIN"), createDoctor);

export default router;
