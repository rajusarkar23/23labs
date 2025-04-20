import { Router } from "express";
import { changeMemberStatus, getMember, signin, signup, verifyOtp } from "../controllers/admin.controller";
import { adminOtpVerifySession } from "../lib/middlewares";

const router = Router()

router.post("/admin/auth/signin", signin)
router.post("/admin/auth/signup", signup)
router.post("/admin/auth/verify-otp", adminOtpVerifySession, verifyOtp)
router.get("/admin/get-members", adminOtpVerifySession, getMember)
router.get("/admin/update-member-status", changeMemberStatus)

export default router;