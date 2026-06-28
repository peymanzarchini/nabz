import { Router } from "express";
import { listingController } from "../controller/listing.controller.js";
import {
  adminOnly,
  authenticate,
  moderatorAccess,
  sellerAccess,
} from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { uploadListingImages } from "@/middlewares/upload.middleware.js";
import {
  createListingSchema,
  deleteListingImageSchema,
  getListingQuerySchema,
  idParamSchema,
  toggleAmazingOfferSchema,
  updateListingSchema,
  updateListingStatusSchema,
} from "../validations/listing.schema.js";
import { categoryController } from "../controller/category.controller.js";
import { createCategorySchema, updateCategorySchema } from "../validations/category.schema.js";
import { reviewController } from "../controller/review.controller.js";
import { createReviewSchema } from "../validations/review.schema.js";
import { createLocationSchema } from "../validations/location.schema.js";
import { locationController } from "../controller/location.controller.js";

const router = Router();

router.get("/categories", categoryController.getAllCategories);
router.get("/locations", locationController.getAllLocations);
router.get("/listings", validate(getListingQuerySchema), listingController.getAllListings);
router.get("/listings/:id", validate(idParamSchema), listingController.getListingById);
router.get("/listings/:id/reviews", reviewController.getListingReviews);

router.use(authenticate);

router.post(
  "/listings",
  sellerAccess,
  uploadListingImages,
  validate(createListingSchema),
  listingController.createListing,
);
router.patch(
  "/listings/:id",
  sellerAccess,
  validate(updateListingSchema),
  listingController.updateListing,
);
router.delete(
  "/listings/:id",
  sellerAccess,
  validate(idParamSchema),
  listingController.deleteListing,
);
router.delete(
  "/listings/:id/images",
  sellerAccess,
  validate(deleteListingImageSchema),
  listingController.deleteListingImage,
);

router.post("/listings/:id/reviews", validate(createReviewSchema), reviewController.createReview);

router.use(moderatorAccess);

router.patch(
  "/listings/:id/status",
  validate(updateListingStatusSchema),
  listingController.updateListingStatus,
);

router.use(adminOnly);
router.post("/categories", validate(createCategorySchema), categoryController.createCategory);
router.patch("/categories/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.patch(
  "/listings/:id/offer",
  validate(toggleAmazingOfferSchema),
  listingController.toggleAmazingOffer,
);
router.post("/locations", validate(createLocationSchema), locationController.createLocation);
export default router;
