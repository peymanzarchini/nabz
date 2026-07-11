import { HttpError } from "@/utils/httpError.js";
import { Category } from "../models/category.model.js";
import {
  CreateListingInput,
  GetListingQuery,
  UpdateListingInput,
  UpdateListingStatusInput,
} from "../validations/listing.schema.js";
import { Listing } from "../models/listing.model.js";
import { ListingVariant } from "../models/variant.model.js";
import { ListingSpecs, ListingStatus, SpecValue } from "../types/index.js";
import { InferAttributes, Op, Order, WhereOptions } from "@sequelize/core";
import { Auth } from "@/modules/auth/model/auth.model.js";
import { UserRole } from "@/types/index.js";
import path from "path";
import fs from "fs";
import { logger } from "@/config/logger.js";
import { Location } from "../models/location.model.js";
import { sequelize } from "@/config/database.js";
import { generateSlug } from "@/utils/slugify.js";
import { getRecursiveCategoryIds } from "@/utils/getRecursiveCategoryIds.js";

class ListingService {
  async createListing(userId: string, data: CreateListingInput, images: Express.Multer.File[]) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) throw HttpError.notFound("دسته‌بندی مورد نظر یافت نشد.");

    if (!images || images.length === 0) {
      throw HttpError.badRequest("حداقل یک تصویر برای آگهی الزامی است.");
    }
    if (!data.variants || data.variants.length === 0) {
      throw HttpError.badRequest("حداقل یک واریانت (قیمت) برای آگهی الزامی است.");
    }

    const imagePaths = images.map((img) => `/uploads/${img.filename}`);
    const thumbnailIndex = data.thumbnailIndex < imagePaths.length ? data.thumbnailIndex : 0;
    const thumbnailPath = imagePaths[thumbnailIndex];

    const minPrice = Math.min(...data.variants.map((v) => v.price));

    const slug = generateSlug(data.title);

    return await sequelize.transaction(async (transaction) => {
      const listing = await Listing.create(
        {
          title: data.title,
          description: data.description,
          slug,
          isNegotiable: data.isNegotiable,
          condition: data.condition,
          cityId: data.cityId,
          districtId: data.districtId,
          latitude: data.latitude,
          longitude: data.longitude,
          categoryId: data.categoryId,
          thumbnail: thumbnailPath,
          images: imagePaths,
          specs: data.specs as ListingSpecs,
          userId,
          status: ListingStatus.PENDING,
          minPrice,
        },
        { transaction },
      );

      const variantRecords = data.variants.map((v) => {
        const hasDiscount = v.discountPercentage && v.discountPercentage > 0;
        const finalPrice = hasDiscount ? v.price - (v.price * v.discountPercentage) / 100 : v.price;

        return {
          listingId: listing.id,
          specs: v.specs,
          price: v.price,
          stock: v.stock,
          discountPercentage: v.discountPercentage || 0,
          discountExpiry: v.discountExpiry,
          finalPrice: finalPrice,
        };
      });

      await ListingVariant.bulkCreate(variantRecords, { transaction });

      return listing;
    });
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
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    if (categoryId) {
      const categoryIds = await getRecursiveCategoryIds(categoryId);
      where = { ...where, categoryId: { [Op.in]: categoryIds } };
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
      where = { ...where, minPrice: priceFilter };
    }

    if (isAmazingOffer === true) {
      where = { ...where, isAmazingOffer: true };
    }

    let order: Order = [["createdAt", "DESC"]];
    if (sort === "cheapest") order = [["minPrice", "ASC"]];
    else if (sort === "expensive") order = [["minPrice", "DESC"]];
    else if (sort === "top_rated") order = [["averageRating", "DESC"]];

    const { rows, count } = await Listing.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug", "specsSchema"] },
        { model: Location, as: "city", attributes: ["id", "name", "slug"] },
        { model: Location, as: "district", attributes: ["id", "name", "slug"] },
        {
          model: Auth,
          as: "user",
          attributes: ["id", "firstName", "lastName", "avatar", "phoneNumber"],
        },
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

  async getListingById(idOrSlug: string, userId?: string, role?: UserRole) {
    const isUUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        idOrSlug,
      );

    const whereCondition = isUUID ? { id: idOrSlug } : { slug: idOrSlug };

    const listing = await Listing.findOne({
      where: whereCondition,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug", "specsSchema"],
        },
        {
          model: Location,
          as: "city",
          attributes: ["id", "name", "slug"],
        },
        {
          model: Location,
          as: "district",
          attributes: ["id", "name", "slug"],
        },
        {
          model: Auth,
          as: "user",
          attributes: ["id", "firstName", "lastName", "avatar", "phoneNumber"],
        },
        {
          model: ListingVariant,
          as: "variants",
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

    const rawSchema = listing.category?.specsSchema as unknown;
    if (
      rawSchema &&
      typeof rawSchema === "object" &&
      "inheritFrom" in rawSchema &&
      typeof (rawSchema as Record<string, unknown>).inheritFrom === "number"
    ) {
      const inheritData = rawSchema as { inheritFrom: string };
      const sourceCat = await Category.findByPk(inheritData.inheritFrom, {
        attributes: ["specsSchema"],
      });
      if (sourceCat?.specsSchema) {
        listing.category?.setDataValue("specsSchema", sourceCat.specsSchema);
      }
    }

    return listing;
  }

  async updateListing(id: string, userId: string, role: UserRole, data: UpdateListingInput) {
    const listing = await Listing.findByPk(id);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد");

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw HttpError.forbidden("شما فقط می‌توانید آگهی خودتان را ویرایش کنید.");
    }

    return await sequelize.transaction(async (transaction) => {
      if (data.specs !== undefined) {
        const existingSpecs: ListingSpecs = (listing.specs || {}) as ListingSpecs;
        const incomingSpecs = data.specs as ListingSpecs;
        const mergedSpecs: ListingSpecs = { ...existingSpecs };

        for (const key in incomingSpecs) {
          if (Object.prototype.hasOwnProperty.call(incomingSpecs, key)) {
            const incomingValue: SpecValue = incomingSpecs[key];
            if (incomingValue === null) {
              delete mergedSpecs[key];
            } else {
              mergedSpecs[key] = incomingValue;
            }
          }
        }
        listing.specs = mergedSpecs;
      }

      if (data.title) listing.title = data.title;
      if (data.description) listing.description = data.description;
      if (data.condition) listing.condition = data.condition;
      if (data.cityId) listing.cityId = data.cityId;
      if (data.districtId !== undefined) listing.districtId = data.districtId;
      if (data.latitude !== undefined) listing.latitude = data.latitude;
      if (data.longitude !== undefined) listing.longitude = data.longitude;

      if (data.variants && data.variants.length > 0) {
        await ListingVariant.destroy({ where: { listingId: listing.id }, transaction });

        const variantRecords = data.variants.map((v) => {
          const hasDiscount = v.discountPercentage && v.discountPercentage > 0;
          const finalPrice = hasDiscount
            ? v.price - (v.price * v.discountPercentage) / 100
            : v.price;

          return {
            listingId: listing.id,
            specs: v.specs,
            price: v.price,
            stock: v.stock,
            discountPercentage: v.discountPercentage || 0,
            discountExpiry: v.discountExpiry,
            finalPrice: finalPrice,
          };
        });

        await ListingVariant.bulkCreate(variantRecords, { transaction });
        listing.minPrice = Math.min(...data.variants.map((v) => v.price));
      }

      await listing.save({ transaction });
      return listing;
    });
  }

  async deleteListing(id: string, userId: string, role: UserRole): Promise<{ message: string }> {
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
    id: string,
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

  async toggleAmazingOffer(id: string, isAmazingOffer: boolean) {
    const listing = await Listing.findByPk(id, {
      include: [{ model: ListingVariant, as: "variants" }],
    });

    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    if (isAmazingOffer === false) {
      listing.isAmazingOffer = false;
      await listing.save();
      return { message: "پیشنهاد شگفت‌انگیز لغو شد." };
    }

    const variants = listing.variants;
    if (!variants || variants.length === 0) {
      throw HttpError.badRequest("این آگهی واریانتی برای بررسی تخفیف ندارد.");
    }

    const hasValidDiscount = variants.some(
      (v: ListingVariant) =>
        v.discountPercentage >= 15 &&
        v.discountExpiry !== null &&
        new Date(v.discountExpiry) > new Date(Date.now() + 60 * 60 * 1000),
    );

    if (!hasValidDiscount) {
      throw HttpError.badRequest(
        "قانون شگفت‌انگیز: حداقل یکی از واریانت‌ها باید حداقل ۱۵٪ تخفیف با تاریخ اعتبار حداقل یک ساعت آینده داشته باشد.",
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

  async deleteListingImage(id: string, userId: string, role: UserRole, imageUrl: string) {
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
