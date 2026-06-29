import { z } from "zod";

const specFieldTypes = ["string", "number", "dropdown", "boolean"] as const;

const specFieldSchema = z.object({
  label: z.string().min(1, "عنوان فیلد الزامی است"),
  type: z.enum(specFieldTypes, {
    message: "نوع فیلد نامعتبر است",
  }),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional().default(false),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "نام دسته‌بندی الزامی است"),
    slug: z
      .string()
      .trim()
      .min(2, "اسلاگ الزامی است")
      .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف کوچک، عدد و خط تیره باشد"),
    parentId: z.coerce.number().optional().nullable(),
    icon: z.string().optional().nullable(),
    specsSchema: z.record(z.string(), specFieldSchema).optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().trim().min(2).optional(),
    slug: z
      .string()
      .trim()
      .min(2)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    parentId: z.coerce.number().optional().nullable(),
    icon: z.string().optional().nullable(),
    specsSchema: z
      .record(z.string(), z.union([specFieldSchema.partial(), z.null()]))
      .optional()
      .nullable(),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
