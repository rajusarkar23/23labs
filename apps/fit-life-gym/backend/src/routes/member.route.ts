import { Router } from "express";
import { signup } from "../controllers/member.controller";

const router = Router()

router.post("/member/auth/signup", signup)

export default router;