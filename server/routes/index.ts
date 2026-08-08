import { Router } from "express";
import authRoutes from "@/modules/auth/routes/auth.routes.js";
import marketPlaceRoutes from "@/modules/marketplace/routes/marketplace.routes.js";
import aiRoutes from "@/modules/ai/routes/ai.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.success("Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/marketplace", marketPlaceRoutes);

router.use("/ai", aiRoutes);

export default router;
