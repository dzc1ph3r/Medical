import { Router } from "express";
import { login, register, me, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", auth, me);

export default router;
