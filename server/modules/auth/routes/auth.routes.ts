import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendSchema,
  resetPasswordSchema,
} from "../validations/auth.schema.js";
import { authenticate } from "@/middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/resend", validate(resendSchema), authController.resend);
router.post("/verify", authController.verify);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post("/logout", authController.logout);

router.use(authenticate);
router.get("/profile", authController.getProfile);
router.post("/change-password", validate(changePasswordSchema), authController.changePassword);

export default router;
