"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const middlewares_1 = __importDefault(require("../lib/middlewares"));
const router = (0, express_1.Router)();
router.post("/member/auth/signup", member_controller_1.signup);
router.post("/member/auth/verify-otp", middlewares_1.default, member_controller_1.verifyOtp);
router.post("/member/auth/signin", member_controller_1.signin);
exports.default = router;
