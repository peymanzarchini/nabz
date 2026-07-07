import { sequelize } from "@/config/database.js";
import { Review } from "../models/review.model.js";
import { Listing } from "../models/listing.model.js";
import { Auth } from "@/modules/auth/model/auth.model.js";
import { HttpError } from "@/utils/httpError.js";
import { CreateReviewInput, UpdateReviewStatusInput } from "../validations/review.schema.js";
import { ReviewStatus } from "../types/index.js";

class ReviewService {
  async createReview(userId: string, listingId: string, data: CreateReviewInput) {
    return await sequelize.transaction(async (t) => {
      const listing = await Listing.findByPk(listingId, { transaction: t });
      if (!listing) throw HttpError.notFound("آگهی مورد نظر یافت نشد.");

      if (listing.userId === userId) {
        throw HttpError.forbidden("شما نمی‌توانید به آگهی خودتان نظر دهید.");
      }

      if (!data.parentId) {
        const existingReview = await Review.findOne({
          where: { userId, listingId, parentId: null },
          transaction: t,
        });
        if (existingReview) {
          throw HttpError.conflict("شما قبلاً برای این آگهی نظر ثبت کرده‌اید.");
        }
      } else {
        const parentReview = await Review.findByPk(data.parentId, { transaction: t });
        if (!parentReview) throw HttpError.notFound("دیدگاه اصلی یافت نشد.");

        if (parentReview.parentId) {
          throw HttpError.badRequest(
            "شما نمی‌توانید به یک پاسخ، پاسخ دهید. فقط می‌توانید به دیدگاه اصلی پاسخ دهید.",
          );
        }
      }

      const reviewData = {
        ...data,
        userId,
        listingId,
        rating: data.parentId ? null : (data.rating ?? null),
      };

      const review = await Review.create(reviewData, { transaction: t });

      if (!data.parentId && data.rating) {
        const newReviewCount = listing.reviewCount + 1;
        const newAverageRating =
          (listing.averageRating * listing.reviewCount + data.rating) / newReviewCount;
        listing.reviewCount = newReviewCount;
        listing.averageRating = parseFloat(newAverageRating.toFixed(2));
        await listing.save({ transaction: t });
      }

      return review;
    });
  }

  async getListingReviews(listingId: string) {
    const reviews = await Review.findAll({
      where: {
        listingId,
        parentId: null,
        status: ReviewStatus.APPROVED,
      },
      include: [
        { model: Auth, as: "user", attributes: ["id", "firstName", "lastName", "avatar"] },

        {
          model: Review,
          as: "replies",
          where: { status: ReviewStatus.APPROVED },
          required: false,
          include: [
            { model: Auth, as: "user", attributes: ["id", "firstName", "lastName", "avatar"] },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return reviews;
  }

  async getPendingReviews() {
    const reviews = await Review.findAll({
      where: { status: ReviewStatus.PENDING },
      include: [
        { model: Auth, as: "user", attributes: ["id", "firstName", "lastName", "avatar"] },
        { model: Listing, as: "listing", attributes: ["id", "title"] },
        { model: Review, as: "parent", attributes: ["id", "comment"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    return reviews;
  }

  async updateReviewStatus(reviewId: string, data: UpdateReviewStatusInput) {
    const review = await Review.findByPk(reviewId);
    if (!review) throw HttpError.notFound("دیدگاه یافت نشد.");

    review.status = data.status;

    if (data.status === ReviewStatus.REJECTED) {
      review.rejectionReason = data.rejectionReason || null;
    } else {
      review.rejectionReason = null;
    }

    await review.save();
    return review;
  }
}

export const reviewService = new ReviewService();
