import { Router } from "express";
import authRoutes from "@/modules/auth/routes/auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.success("Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

export default router;
