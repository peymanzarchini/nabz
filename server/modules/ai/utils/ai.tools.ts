import { FunctionDeclarationsTool, SchemaType } from "@google/generative-ai";
import { reviewService } from "@/modules/marketplace/services/review.service.js";
import { listingService } from "@/modules/marketplace/services/listing.service.js";
import { Review } from "@/modules/marketplace/models/review.model.js";

interface GetListingReviewsInput {
  listingId: string;
}

interface GetDashboardStatsInput {
  userId: string;
  role: string;
}

export const aiTools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      {
        name: "get_listing_reviews",
        description: "دریافت لیست کامنت‌ها و نظرات یک آگهی خاص بر اساس ID آگهی برای تحلیل کاربران",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            listingId: {
              type: SchemaType.STRING,
              description: "آیدی (UUID) آگهی مورد نظر",
            },
          },
          required: ["listingId"],
        },
      },
      {
        name: "get_dashboard_stats",
        description: "دریافت آمار کلی داشبورد کاربر (تعداد آگهی‌های فعال، در انتظار تایید و...)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            userId: {
              type: SchemaType.STRING,
              description: "آیدی کاربر",
            },
            role: {
              type: SchemaType.STRING,
              description: "نقش کاربر (admin, seller, etc)",
            },
          },
          required: ["userId", "role"],
        },
      },
    ],
  },
];

export async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<unknown> {
  switch (toolName) {
    case "get_listing_reviews": {
      const { listingId } = toolInput as unknown as GetListingReviewsInput;
      const reviews: Review[] = await reviewService.getListingReviews(listingId);

      return reviews.map((r) => ({
        rating: r.rating,
        comment: r.comment,
        pros: r.pros,
        cons: r.cons,
      }));
    }

    case "get_dashboard_stats": {
      const { userId, role } = toolInput as unknown as GetDashboardStatsInput;
      return await listingService.getDashboardStats(userId, role);
    }

    default:
      throw new Error(`Tool ${toolName} not found`);
  }
}
