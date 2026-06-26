import { Router } from "express";
import authRoutes from "@/modules/auth/routes/auth.routes.js";
import marketPlaceRoutes from "@/modules/marketplace/routes/marketplace.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.success("Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/marketplace", marketPlaceRoutes);

export default router;
