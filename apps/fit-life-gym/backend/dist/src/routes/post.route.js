"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../lib/middlewares");
const post_controller_1 = require("../controllers/post.controller");
const router = (0, express_1.Router)();
router.post("/member/post/create", middlewares_1.userAuthSession, post_controller_1.create);
exports.default = router;
