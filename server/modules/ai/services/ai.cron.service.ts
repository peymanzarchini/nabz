import { GoogleGenerativeAI } from "@google/generative-ai";
import { Listing } from "@/modules/marketplace/models/listing.model.js";
import { Review } from "@/modules/marketplace/models/review.model.js";
import { ReviewStatus } from "@/modules/marketplace/types/index.js";
import { logger } from "@/config/logger.js";
import { env } from "@/config/env.js";
import { Op } from "@sequelize/core";

const genAI = new GoogleGenerativeAI(env.ai.apiKey || "dummy_key_for_dev");

export const runReviewSummaryCron = async (): Promise<void> => {
  logger.info("🕒 [Cron Job] شروع پردازش خلاصه نظرات با Gemini...");

  try {
    const listings = await Listing.findAll({
      where: {
        reviewCount: { [Op.gt]: 0 },
      },
      include: [
        {
          model: Review,
          as: "reviews",
          where: { status: ReviewStatus.APPROVED },
          required: true,
        },
      ],
    });

    if (listings.length === 0) {
      logger.info("ℹ️ [Cron Job] آگهی با نظر جدیدی یافت نشد.");
      return;
    }

    logger.info(`📊 [Cron Job] ${listings.length} آگهی برای تحلیل پیدا شد.`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const listing of listings) {
      const reviews = listing.reviews;
      if (!reviews || reviews.length === 0) continue;

      const reviewsText = reviews
        .map((r: Review) => `امتیاز: ${r.rating || "بدون امتیاز"} - نظر: ${r.comment}`)
        .join("\n");

      const prompt = `لیست نظرات کاربران برای یک آگهی به شرح زیر است:\n\n${reviewsText}\n\nلطفاً یک خلاصه کوتاه، حرفه‌ای و فارسی از این نظرات بنویس (حداکثر ۳ جمله) که حس کلی کاربران را نشان دهد و مشکلات احتمالی را ذکر کند. مستقیماً متن خلاصه را بنویس و هیچ کلمه اضافه‌ای نگو.`;

      const result = await model.generateContent(prompt);
      const summaryText = result.response.text();

      listing.aiReviewSummary = summaryText;
      await listing.save();

      logger.info(`✅ [Cron Job] خلاصه آگهی ${listing.id} بروزرسانی شد.`);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    logger.info("🎉 [Cron Job] پردازش خلاصه نظرات با موفقیت به پایان رسید.");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`❌ [Cron Job] خطا در پردازش: ${errorMessage}`);
  }
};
