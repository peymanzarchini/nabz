import { z } from "zod";

export const createLocationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "نام شهر/محله الزامی است"),
    slug: z
      .string()
      .trim()
      .min(2, "اسلاگ الزامی است")
      .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف کوچک، عدد و خط تیره"),
    parentId: z.uuid("آیدی وارد شده نامعتبر است").optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
  }),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>["body"];
