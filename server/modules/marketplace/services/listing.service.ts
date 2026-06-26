import { HttpError } from "@/utils/httpError.js";
import { Category } from "../models/category.model.js";
import { CreateListingInput } from "../validations/listing.schema.js";
import { Listing } from "../models/listing.model.js";
import { ListingStatus } from "../types/index.js";

class ListingService {
  async createListing(userId: number, data: CreateListingInput, images: Express.Multer.File[]) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) throw HttpError.notFound("دسته‌بندی مورد نظر یافت نشد.");

    if (!images || images.length === 0) {
      throw HttpError.badRequest("حداقل یک تصویر برای آگهی الزامی است.");
    }

    const imagePaths = images.map((img) => `/uploads/${img.filename}`);

    const listing = await Listing.create({
      ...data,
      userId,
      images: imagePaths,
      status: ListingStatus.PENDING,
    });

    return listing;
  }
}

export const listingService = new ListingService();
