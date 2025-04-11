"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const middlewares_1 = require("../lib/middlewares");
const router = (0, express_1.Router)();
router.post("/admin/auth/signin", admin_controller_1.signin);
router.post("/admin/auth/signup", admin_controller_1.signup);
router.post("/admin/auth/verify-otp", middlewares_1.adminOtpVerifySession, admin_controller_1.verifyOtp);
router.get("/admin/get-members", middlewares_1.adminOtpVerifySession, admin_controller_1.getMember);
exports.default = router;
