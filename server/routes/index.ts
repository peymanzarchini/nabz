import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.success("Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
