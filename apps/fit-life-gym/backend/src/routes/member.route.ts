import { Router } from "express";
import {
  getProfileDetails,
  signin,
  signup,
  updateName,
  updateUserName,
  verifyOtp,
} from "../controllers/member.controller";
import { otpVerifySession, userAuthSession } from "../lib/middlewares";

const router = Router();

router.post("/member/auth/signup", signup);
router.post("/member/auth/verify-otp", otpVerifySession, verifyOtp);
router.post("/member/auth/signin", signin);
router.get("/member/profile/get-profile", userAuthSession, getProfileDetails);
router.put(
  "/member/profile/update-username",
  userAuthSession,
  updateUserName
);
router.put(
  "/member/profile/update-name",
  userAuthSession,
  updateName
);

export default router;
