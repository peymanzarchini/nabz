import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { CreateReviewInput, UpdateReviewStatusInput } from "../validations/review.schema.js";

class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listingId = req.params.id as string;
      const result = await reviewService.createReview(
        req.user!.id,
        listingId,
        req.body as CreateReviewInput,
      );
      res.success("دیدگاه شما با موفقیت ثبت شد.", result, 201);
    } catch (error) {
      next(error);
    }
  }

  async getListingReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listingId = req.params.id as string;
      const result = await reviewService.getListingReviews(listingId);
      res.success("لیست دیدگاه‌ها.", result);
    } catch (error) {
      next(error);
    }
  }

  async getPendingReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewService.getPendingReviews();
      res.success("لیست دیدگاه‌های در انتظار تایید.", result);
    } catch (error) {
      next(error);
    }
  }

  async updateReviewStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewService.updateReviewStatus(
        req.params.id as string,
        req.body as UpdateReviewStatusInput,
      );
      res.success("وضعیت دیدگاه تغییر کرد.", result);
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
