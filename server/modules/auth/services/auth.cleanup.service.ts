import { Op } from "@sequelize/core";
import { Auth } from "../model/auth.model.js";
import { UserStatus } from "@/types/index.js";
import { logger } from "@/config/logger.js";

export const runPendingUsersCleanup = async (): Promise<void> => {
  try {
    const threshold = new Date(Date.now() - 15 * 60 * 1000);

    const deletedCount = await Auth.destroy({
      where: {
        status: UserStatus.PENDING,
        isVerified: false,
        createdAt: { [Op.lt]: threshold },
      },
    });

    if (deletedCount > 0) {
      logger.info(`🧹 [Cron Job] ${deletedCount} کاربر تایید نشده و قدیمی حذف شدند.`);
    }
  } catch (error) {
    logger.error("❌ [Cron Job] خطا در پاکسازی کاربران pending:", error);
  }
};
