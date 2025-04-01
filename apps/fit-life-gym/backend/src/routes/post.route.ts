import { Router } from "express";
import { userAuthSession } from "../lib/middlewares";
import { create } from "../controllers/post.controller";

const router = Router()


router.post("/member/post/create", userAuthSession, create)

export default router;