import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  loginWithOtpSchema,
  registerSchema,
  resendSchema,
  resetPasswordSchema,
  sendPhoneOtpSchema,
  updateRoleSchema,
} from "../validations/auth.schema.js";
import { adminOnly, authenticate } from "@/middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "تعداد درخواست کد بیش از حد مجاز است. لطفاً ۱۰ دقیقه بعد تلاش کنید.",
    body: null,
    status: 429,
  },
});

router.post("/register", validate(registerSchema), authController.register);
router.post("/resend", otpLimiter, validate(resendSchema), authController.resend);
router.post("/verify", authController.verify);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post("/logout", authController.logout);
router.post(
  "/send-phone-otp",
  otpLimiter,
  validate(sendPhoneOtpSchema),
  authController.sendPhoneOtp,
);
router.post("/login-with-otp", validate(loginWithOtpSchema), authController.loginWithOtp);

router.use(authenticate);
router.get("/profile", authController.getProfile);
router.post("/change-password", validate(changePasswordSchema), authController.changePassword);

router.patch(
  "/users/:id/role",
  adminOnly,
  validate(updateRoleSchema),
  authController.updateUserRole,
);

export default router;
