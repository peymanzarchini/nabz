/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { ListingCondition, ListingStatus } from "../types/index.js";

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, "عنوان باید حداقل ۵ کاراکتر باشد").max(100),
    description: z.string().trim().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
    price: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد"),
    isNegotiable: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]),

    cityId: z.coerce.number().int().positive("شهر الزامی است"),
    districtId: z.coerce.number().int().positive().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),

    categoryId: z.coerce.number().int().positive("آیدی دسته‌بندی معتبر نیست"),
    thumbnailIndex: z.coerce.number().int().min(0).optional().default(0),

    stock: z.coerce.number().int().min(0).optional().nullable(),

    specs: z
      .string()
      .optional()
      .nullable()
      .transform((val, ctx) => {
        if (!val) return null;
        try {
          return JSON.parse(val);
        } catch (e) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "فرمت specs باید یک JSON معتبر باشد",
          });
          return z.NEVER;
        }
      }),

    discountPercentage: z.coerce.number().int().min(0).max(100).optional().nullable(),
    discountExpiry: z
      .string()
      .optional()
      .nullable()
      .transform((val, ctx) => {
        if (!val) return null;
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "فرمت تاریخ تخفیف نامعتبر است",
          });
          return z.NEVER;
        }
        return date;
      }),
  }),
});

export const updateListingSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title: z.string().trim().min(5).max(100).optional(),
    description: z.string().trim().min(10).optional(),
    price: z.coerce.number().min(0).optional(),

    isNegotiable: z.boolean().optional(),

    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]).optional(),

    cityId: z.coerce.number().int().positive().optional(),
    districtId: z.coerce.number().int().positive().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),

    stock: z.coerce.number().int().min(0).optional().nullable(),

    specs: z.record(z.string(), z.any()).optional().nullable(),

    discountPercentage: z.coerce.number().int().min(0).max(100).optional().nullable(),

    discountExpiry: z.coerce.date().optional().nullable(),

    status: z.enum([ListingStatus.SOLD]).optional(),
  }),
});

export const getListingQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().optional(),
    categoryId: z.coerce.number().int().optional(),
    cityId: z.coerce.number().int().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]).optional(),
    isAmazingOffer: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    sort: z.enum(["newest", "cheapest", "expensive", "top_rated"]).optional().default("newest"),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const updateListingStatusSchema = z
  .object({
    params: z.object({
      id: z.coerce.number().int().positive(),
    }),
    body: z.object({
      status: z.enum([ListingStatus.ACTIVE, ListingStatus.REJECTED, ListingStatus.SOLD]),
      rejectionReason: z
        .string()
        .min(5, "دلیل رد آگهی باید حداقل ۵ کاراکتر باشد")
        .optional()
        .nullable(),
    }),
  })
  .refine(
    (data) => {
      if (data.body.status === ListingStatus.REJECTED && !data.body.rejectionReason) {
        return false;
      }
      return true;
    },
    {
      message: "در صورت رد آگهی، ارائه دلیل الزامی است",
      path: ["body", "rejectionReason"],
    },
  );

export const toggleAmazingOfferSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    isAmazingOffer: z.boolean(),
  }),
});

export const deleteListingImageSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    imageUrl: z.string().startsWith("/uploads/", "آدرس عکس نامعتبر است"),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>["body"];
export type UpdateListingInput = z.infer<typeof updateListingSchema>["body"];
export type GetListingQuery = z.infer<typeof getListingQuerySchema>["query"];
export type UpdateListingStatusInput = z.infer<typeof updateListingStatusSchema>["body"];
