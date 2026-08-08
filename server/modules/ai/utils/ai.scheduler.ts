import cron from "node-cron";
import { logger } from "@/config/logger.js";
import { runReviewSummaryCron } from "../services/ai.cron.service.js";

export const startAiCronJobs = (): void => {
  cron.schedule("0 2 * * *", async () => {
    logger.info("⏰ [Scheduler] زمان اجرای Cron Job فرا رسید.");
    await runReviewSummaryCron();
  });

  logger.info("✅ [Scheduler] سیستم زمان‌بندی هوش مصنوعی فعال شد (هر شب ساعت ۲:۰۰).");
};
