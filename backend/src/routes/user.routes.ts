import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { updateMe } from "../controllers/user.controller";

const router = Router();

router.patch("/me", auth, updateMe);

export default router;
