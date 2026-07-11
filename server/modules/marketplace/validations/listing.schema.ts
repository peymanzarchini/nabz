/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { ListingCondition, ListingStatus } from "../types/index.js";

const specValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const specsObjectSchema = z.record(z.string(), specValueSchema);

const variantSchema = z.object({
  id: z.coerce.number().optional(),
  specs: z.record(z.string(), z.string()).default({}),
  price: z.coerce.number().min(0, "قیمت واریانت الزامی است"),
  stock: z.coerce.number().int().min(0).default(0),
  discountPercentage: z.coerce.number().int().min(0).max(100).optional().default(0),
  discountExpiry: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  sku: z.string().optional().nullable(),
});

const parseJsonObject = (
  val: string | null | undefined,
  ctx: z.RefinementCtx,
  errorMsg: string,
) => {
  if (!val) return {};
  try {
    return JSON.parse(val);
  } catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: errorMsg });
    return z.NEVER;
  }
};

const parseJsonArray = (val: string | null | undefined, ctx: z.RefinementCtx, errorMsg: string) => {
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: errorMsg });
    return z.NEVER;
  }
};

export const createListingSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "عنوان الزامی است" })
      .trim()
      .min(5, "عنوان باید حداقل ۵ کاراکتر باشد")
      .max(100),
    description: z
      .string({ message: "توضیحات الزامی است" })
      .trim()
      .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
    isNegotiable: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]),

    cityId: z.uuid("آیدی شهر نامعتبر است"),
    districtId: z.uuid().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),

    categoryId: z.uuid("آیدی دسته بندی نامعتبر است."),
    thumbnailIndex: z.coerce.number().int().min(0).optional().default(0),

    specs: z
      .string()
      .optional()
      .nullable()
      .transform((val, ctx) => parseJsonObject(val, ctx, "فرمت specs باید یک JSON معتبر باشد"))
      .pipe(specsObjectSchema),

    variants: z
      .string()
      .optional()
      .nullable()
      .transform((val, ctx) => parseJsonArray(val, ctx, "فرمت variants باید یک JSON معتبر باشد"))
      .pipe(z.array(variantSchema)),
  }),
});

export const updateListingSchema = z.object({
  params: z.object({
    id: z.uuid("آیدی آگهی نامعتبر است"),
  }),
  body: z.object({
    title: z.string().trim().min(5).max(100).optional(),
    description: z.string().trim().min(10).optional(),
    isNegotiable: z.boolean().optional(),
    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]).optional(),

    cityId: z.uuid().optional(),
    districtId: z.uuid().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),

    specs: z
      .union([z.string(), specsObjectSchema])
      .optional()
      .nullable()
      .transform((val, ctx) => {
        if (typeof val === "string") return parseJsonObject(val, ctx, "فرمت specs نامعتبر است");
        return val;
      })
      .pipe(specsObjectSchema.optional()),

    variants: z
      .union([z.string(), z.array(variantSchema)])
      .optional()
      .nullable()
      .transform((val, ctx) => {
        if (typeof val === "string") return parseJsonArray(val, ctx, "فرمت variants نامعتبر است");
        return val;
      })
      .pipe(z.array(variantSchema).optional()),

    status: z.enum([ListingStatus.SOLD]).optional(),
  }),
});

export const getListingQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().optional(),

    categoryId: z.uuid("آیدی دسته بندی نامعتبر است").optional(),
    cityId: z.uuid("آیدی شهر نامعتبر است").optional(),

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
    id: z.uuid("آیدی وارد شده نامعتبر است"),
  }),
});

export const idOrSlugParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "آیدی یا اسلاگ الزامی است"),
  }),
});

export const updateListingStatusSchema = z
  .object({
    params: z.object({
      id: z.uuid("آیدی وارد شده نامعتبر است"),
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
    id: z.uuid("آیدی وارد شده نامعتبر است"),
  }),
  body: z.object({
    isAmazingOffer: z.boolean(),
  }),
});

export const deleteListingImageSchema = z.object({
  params: z.object({
    id: z.uuid("آیدی وارد شده نامعتبر است"),
  }),
  body: z.object({
    imageUrl: z.string().startsWith("/uploads/", "آدرس عکس نامعتبر است"),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>["body"];
export type UpdateListingInput = z.infer<typeof updateListingSchema>["body"];
export type GetListingQuery = z.infer<typeof getListingQuerySchema>["query"];
export type UpdateListingStatusInput = z.infer<typeof updateListingStatusSchema>["body"];
