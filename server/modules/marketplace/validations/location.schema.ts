import { z } from "zod";

export const createLocationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "نام شهر/محله الزامی است"),
    slug: z
      .string()
      .trim()
      .min(2, "اسلاگ الزامی است")
      .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف کوچک، عدد و خط تیره"),
    parentId: z.coerce.number().int().optional().nullable(),
  }),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>["body"];
