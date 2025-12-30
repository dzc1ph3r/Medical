"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.auth, (0, role_middleware_1.requireRole)("PATIENT"), notification_controller_1.getMyNotifications);
exports.default = router;
