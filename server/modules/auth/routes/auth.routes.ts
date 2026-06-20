import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { registerSchema } from "../validations/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/resend", AuthController.resend);
router.post("/verify", AuthController.verify);

export default router;
