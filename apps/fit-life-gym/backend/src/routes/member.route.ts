import { Router } from "express";
import { signin, signup, verifyOtp } from "../controllers/member.controller";
import otpVerifySession from "../lib/middlewares";

const router = Router()

router.post("/member/auth/signup", signup)
router.post("/member/auth/verify-otp", otpVerifySession , verifyOtp)
router.post("/member/auth/signin" , signin)

export default router;