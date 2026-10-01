import cron from "node-cron";
import { logger } from "@/config/logger.js";
import { runPendingUsersCleanup } from "../services/auth.cleanup.service.js";

export const startAuthCronJobs = (): void => {
  cron.schedule("*/10 * * * *", async () => {
    logger.info("⏰ [Scheduler] زمان بررسی کاربران تایید نشده (Cleanup) فرا رسید.");
    await runPendingUsersCleanup();
  });

  logger.info("✅ [Scheduler] سیستم پاکسازی کاربران pending فعال شد (هر ۱۰ دقیقه).");
};
