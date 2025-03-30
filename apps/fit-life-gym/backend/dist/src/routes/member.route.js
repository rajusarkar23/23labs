"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const router = (0, express_1.Router)();
router.post("/member/auth/signup", member_controller_1.signup);
exports.default = router;
