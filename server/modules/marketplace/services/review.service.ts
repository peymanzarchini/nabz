import { sequelize } from "@/config/database.js";
import { Review } from "../models/review.model.js";
import { Listing } from "../models/listing.model.js";
import { Auth } from "@/modules/auth/model/auth.model.js";
import { HttpError } from "@/utils/httpError.js";
import { CreateReviewInput } from "../validations/review.schema.js";

class ReviewService {
  async createReview(userId: number, listingId: number, data: CreateReviewInput) {
    return await sequelize.transaction(async (t) => {
      const listing = await Listing.findByPk(listingId, { transaction: t });
      if (!listing) throw HttpError.notFound("آگهی مورد نظر یافت نشد.");

      if (listing.userId === userId) {
        throw HttpError.forbidden("شما نمی‌توانید به آگهی خودتان نظر دهید.");
      }

      const existingReview = await Review.findOne({
        where: { userId, listingId },
        transaction: t,
      });
      if (existingReview) {
        throw HttpError.conflict("شما قبلاً برای این آگهی نظر ثبت کرده‌اید.");
      }

      const review = await Review.create({ ...data, userId, listingId }, { transaction: t });

      const newReviewCount = listing.reviewCount + 1;

      const newAverageRating =
        (listing.averageRating * listing.reviewCount + data.rating) / newReviewCount;

      listing.reviewCount = newReviewCount;
      listing.averageRating = parseFloat(newAverageRating.toFixed(2));
      await listing.save({ transaction: t });

      return review;
    });
  }

  async getListingReviews(listingId: number) {
    const reviews = await Review.findAll({
      where: { listingId },
      attributes: {
        exclude: ["userId", "listingId"],
      },
      include: [{ model: Auth, as: "user", attributes: ["id", "firstName", "lastName", "avatar"] }],
      order: [["createdAt", "DESC"]],
    });

    return reviews;
  }
}

export const reviewService = new ReviewService();
