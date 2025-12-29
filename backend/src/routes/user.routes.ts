import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { updateMe, updatePassword } from "../controllers/user.controller";

const router = Router();

router.patch("/me", auth, updateMe);
router.patch("/me/password", auth, updatePassword);

export default router;
