"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.patch("/me", auth_middleware_1.auth, user_controller_1.updateMe);
router.patch("/me/password", auth_middleware_1.auth, user_controller_1.updatePassword);
exports.default = router;
