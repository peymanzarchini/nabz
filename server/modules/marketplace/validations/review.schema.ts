import { z } from "zod";

export const createReviewSchema = z.object({
  params: {
    id: z.coerce.number(),
  },
  body: z.object({
    rating: z.number().int().min(1, "حداقل امتیاز ۱ است").max(5, "حداکثر امتیاز ۵ است"),
    title: z.string().trim().max(100).optional(),
    comment: z.string().trim().min(5, "متن دیدگاه حداقل باید ۵ کاراکتر باشد"),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
