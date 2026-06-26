import { z } from "zod";
import { ListingCondition } from "../types/index.js";

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, "عنوان باید حداقل 5 کاراکتر باشد.").max(100),
    description: z.string().trim().min(10, "توضیحات باید حداقل 10 کاراکتر باشد."),
    price: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد"),
    isNegotiable: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    condition: z.enum([ListingCondition.NEW, ListingCondition.USED]),
    city: z.string().trim().min(2, "شهر الزامی است"),
    district: z.string().trim().optional(),
    categoryId: z.coerce.number().int().positive("آیدی دسته‌بندی معتبر نیست"),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>["body"];
