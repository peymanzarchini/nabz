import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { chatSchema } from "../validations/ai.schema.js";
import { aiController } from "../controllers/ai.controller.js";

const router = Router();

router.use(authenticate);
router.post("/chat", validate(chatSchema), aiController.chat);

export default router;
