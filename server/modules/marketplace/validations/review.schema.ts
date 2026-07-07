import { z } from "zod";
import { ReviewStatus } from "../types/index.js";

export const createReviewSchema = z
  .object({
    params: z.object({
      id: z.uuid("آیدی وارد شده نامعتبر است"),
    }),
    body: z.object({
      rating: z
        .number()
        .int()
        .min(1, "حداقل امتیاز ۱ است")
        .max(5, "حداکثر امتیاز ۵ است")
        .optional()
        .nullable(),
      title: z.string().trim().max(100).optional(),
      comment: z.string().trim().min(5, "متن دیدگاه حداقل باید ۵ کاراکتر باشد"),
      pros: z.array(z.string()).optional(),
      cons: z.array(z.string()).optional(),
      parentId: z.uuid("آیدی وارد شده نامعتبر است"),
    }),
  })
  .refine(
    (data) => {
      if (!data.body.parentId && (data.body.rating === null || data.body.rating === undefined)) {
        return false;
      }
      return true;
    },
    {
      message: "برای دیدگاه اصلی، ثبت امتیاز الزامی است",
      path: ["body", "rating"],
    },
  );

export const updateReviewStatusSchema = z
  .object({
    params: z.object({
      id: z.uuid("آیدی وارد شده نامعتبر است"),
    }),
    body: z.object({
      status: z.enum([ReviewStatus.APPROVED, ReviewStatus.REJECTED]),
      rejectionReason: z
        .string()
        .min(5, "دلیل رد دیدگاه باید حداقل ۵ کاراکتر باشد")
        .optional()
        .nullable(),
    }),
  })
  .refine(
    (data) => {
      if (data.body.status === ReviewStatus.REJECTED && !data.body.rejectionReason) {
        return false;
      }
      return true;
    },
    {
      message: "در صورت رد کردن دیدگاه، ارائه دلیل الزامی است",
      path: ["body", "rejectionReason"],
    },
  );

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>["body"];
