import { HttpError } from "@/utils/httpError.js";
import { Category } from "../models/category.model.js";
import {
  CreateListingInput,
  GetListingQuery,
  UpdateListingInput,
  UpdateListingStatusInput,
} from "../validations/listing.schema.js";
import { Listing } from "../models/listing.model.js";
import { ListingSpecs, ListingStatus } from "../types/index.js";
import { InferAttributes, Op, Order, WhereOptions } from "@sequelize/core";
import { Auth } from "@/modules/auth/model/auth.model.js";
import { UserRole } from "@/types/index.js";
import path from "path";
import fs from "fs";
import { logger } from "@/config/logger.js";

class ListingService {
  async createListing(userId: number, data: CreateListingInput, images: Express.Multer.File[]) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) throw HttpError.notFound("دسته‌بندی مورد نظر یافت نشد.");

    if (!images || images.length === 0) {
      throw HttpError.badRequest("حداقل یک تصویر برای آگهی الزامی است.");
    }

    const imagePaths = images.map((img) => `/uploads/${img.filename}`);
    const thumbnailIndex = data.thumbnailIndex < imagePaths.length ? data.thumbnailIndex : 0;
    const thumbnailPath = imagePaths[thumbnailIndex];

    const listing = await Listing.create({
      ...data,
      specs: data.specs as ListingSpecs,
      userId,
      images: imagePaths,
      thumbnail: thumbnailPath,
      status: ListingStatus.PENDING,
    });

    return listing;
  }

  async getAllListings(query: GetListingQuery) {
    const {
      isAmazingOffer,
      limit,
      page,
      sort,
      categoryId,
      cityId,
      condition,
      maxPrice,
      minPrice,
      search,
    } = query;

    const offset = (page - 1) * limit;

    let where: WhereOptions<InferAttributes<Listing>> = {
      status: ListingStatus.ACTIVE,
    };

    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          {
            description: { [Op.like]: `%${search}%` },
          },
        ],
      };
    }

    if (categoryId) {
      where = { ...where, categoryId };
    }

    if (condition) {
      where = { ...where, condition };
    }

    if (cityId) {
      where = { ...where, cityId };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: { [Op.gte]?: number; [Op.lte]?: number } = {};
      if (minPrice !== undefined) priceFilter[Op.gte] = minPrice;
      if (maxPrice !== undefined) priceFilter[Op.lte] = maxPrice;

      where = { ...where, price: priceFilter };
    }

    if (isAmazingOffer !== undefined) {
      where = {
        ...where,
        isAmazingOffer,
        discountExpiry: { [Op.gt]: new Date() },
      };
    }

    let order: Order = [["createdAt", "DESC"]];
    if (sort === "cheapest") order = [["finalPrice", "ASC"]];
    else if (sort === "expensive") order = [["finalPrice", "DESC"]];
    else if (sort === "top_rated") order = [["averageRating", "DESC"]];

    const { rows, count } = await Listing.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug", "specsSchema"] },
      ],
    });

    return {
      items: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getListingById(id: number, userId?: number, role?: UserRole) {
    const listing = await Listing.findByPk(id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug", "specsSchema"] },
        {
          model: Auth,
          as: "user",
          attributes: ["id", "firstName", "lastName", "avatar", "phoneNumber"],
        },
      ],
    });

    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    if (listing.status !== ListingStatus.ACTIVE) {
      const isOwner = userId && listing.userId === userId;
      const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPPORT;

      if (!isOwner && !isAdmin) {
        throw HttpError.notFound("آگهی یافت نشد یا در انتظار تایید است.");
      }
    }

    return listing;
  }

  async updateListing(id: number, userId: number, role: UserRole, data: UpdateListingInput) {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد");

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw HttpError.forbidden("شما فقط می‌توانید آگهی خودتان را ویرایش کنید.");
    }

    await listing.update({
      ...data,
      specs: data.specs as ListingSpecs,
    });
    return listing;
  }

  async deleteListing(id: number, userId: number, role: UserRole): Promise<{ message: string }> {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد");

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw HttpError.forbidden("شما فقط می‌توانید آگهی خودتان را حذف کنید.");
    }

    if (listing.images && listing.images.length > 0) {
      for (const imageUrl of listing.images) {
        const filePath = path.join(process.cwd(), imageUrl);

        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            logger.info(`🖼️ Image deleted from server: ${filePath}`);
          }
        } catch (fileError) {
          logger.error(`Failed to delete image ${filePath}:`, fileError);
        }
      }
    }

    await listing.destroy();
    return { message: "آگهی با موفقیت حذف شد." };
  }

  async updateListingStatus(
    id: number,
    data: UpdateListingStatusInput,
  ): Promise<{ message: string }> {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    listing.status = data.status;

    if (data.status === ListingStatus.REJECTED) {
      listing.rejectionReason = data.rejectionReason || null;
    } else {
      listing.rejectionReason = null;
    }

    await listing.save();
    return { message: "وضعیت آگهی با موفقیت تغییر کرد." };
  }

  async toggleAmazingOffer(id: number, isAmazingOffer: boolean) {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    if (isAmazingOffer === false) {
      listing.isAmazingOffer = false;
      await listing.save();
      return { message: "پیشنهاد شگفت‌انگیز لغو شد." };
    }

    if (!listing.discountPercentage || listing.discountPercentage < 15) {
      throw HttpError.badRequest("قانون شگفت‌انگیز: کالا باید حداقل ۱۵٪ تخفیف داشته باشد.");
    }

    if (
      !listing.discountExpiry ||
      new Date(listing.discountExpiry) <= new Date(Date.now() + 60 * 60 * 1000)
    ) {
      throw HttpError.badRequest(
        "قانون شگفت‌انگیز: تاریخ انقضای تخفیف باید حداقل تا یک ساعت آینده معتبر باشد.",
      );
    }

    if (listing.reviewCount < 3 || listing.averageRating < 4.0) {
      throw HttpError.badRequest(
        "قانون شگفت‌انگیز: کالا باید حداقل ۳ نظر و میانگین امتیاز ۴ ستاره داشته باشد.",
      );
    }

    listing.isAmazingOffer = true;
    await listing.save();

    return { message: "کالا با موفقیت به پیشنهادهای شگفت‌انگیز اضافه شد!" };
  }

  async deleteListingImage(id: number, userId: number, role: UserRole, imageUrl: string) {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw HttpError.forbidden("شما فقط می‌توانید عکس‌های آگهی خودتان را حذف کنید.");
    }

    const currentImages: string[] = listing.images || [];

    if (!currentImages.includes(imageUrl)) {
      throw HttpError.notFound("عکس مورد نظر در این آگهی یافت نشد.");
    }

    const newImages = currentImages.filter((img) => img !== imageUrl);
    listing.images = newImages;

    if (listing.thumbnail === imageUrl) {
      listing.thumbnail = newImages.length > 0 ? newImages[0] : null;
    }

    await listing.save();

    const filePath = path.join(process.cwd(), imageUrl);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.info(`🖼️ Image deleted from server: ${filePath}`);
      }
    } catch (fileError) {
      logger.error(`Failed to delete image ${filePath}:`, fileError);
    }

    return {
      message: "عکس با موفقیت حذف شد.",
      newThumbnail: listing.thumbnail,
    };
  }
}

export const listingService = new ListingService();
