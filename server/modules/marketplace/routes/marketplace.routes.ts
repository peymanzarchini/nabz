import { Router } from "express";

import {
  authenticate,
  sellerAccess,
  moderatorAccess,
  adminOnly,
} from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { uploadListingImages } from "@/middlewares/upload.middleware.js";

import { categoryController } from "../controller/category.controller.js";
import { listingController } from "../controller/listing.controller.js";
import { locationController } from "../controller/location.controller.js";
import { reviewController } from "../controller/review.controller.js";
import { conversationController } from "../controller/conversation.controller.js";

import { createCategorySchema, updateCategorySchema } from "../validations/category.schema.js";
import {
  createListingSchema,
  deleteListingImageSchema,
  getListingQuerySchema,
  idOrSlugParamSchema,
  idParamSchema,
  toggleAmazingOfferSchema,
  updateListingSchema,
  updateListingStatusSchema,
} from "../validations/listing.schema.js";
import { createLocationSchema } from "../validations/location.schema.js";
import { createReviewSchema, updateReviewStatusSchema } from "../validations/review.schema.js";
import {
  getConversationMessagesSchema,
  sendMessageSchema,
  startConversationSchema,
} from "../validations/conversation.schema.js";

const router = Router();

router.get("/categories", categoryController.getAllCategories);
router.get("/locations", locationController.getAllLocations);
router.get("/listings", validate(getListingQuerySchema), listingController.getAllListings);
router.get("/listings/:id", validate(idOrSlugParamSchema), listingController.getListingById);
router.get("/listings/:id/reviews", reviewController.getListingReviews);

router.use(authenticate);

router.get("/stats", listingController.getDashboardStats);
router.post(
  "/conversations",
  validate(startConversationSchema),
  conversationController.startOrGetConversation,
);
router.get("/conversations", conversationController.getUserConversations);
router.post(
  "/conversations/:conversationId/messages",
  validate(sendMessageSchema),
  conversationController.sendMessage,
);
router.get(
  "/conversations/:conversationId/messages",
  validate(getConversationMessagesSchema),
  conversationController.getConversationMessages,
);

router.get("/conversations/unread-count", conversationController.getUnreadCount);

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
  uploadListingImages,
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

router.get("/reviews/pending", reviewController.getPendingReviews);
router.patch(
  "/reviews/:id/status",
  validate(updateReviewStatusSchema),
  reviewController.updateReviewStatus,
);

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
