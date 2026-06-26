import { Router } from "express";
import { listingController } from "../controller/listing.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { uploadListingImages } from "@/middlewares/upload.middleware.js";
import { createListingSchema } from "../validations/listing.schema.js";

const router = Router();

router.use(authenticate);

router.post(
  "/listing",
  uploadListingImages,
  validate(createListingSchema),
  listingController.createListing,
);

export default router;
