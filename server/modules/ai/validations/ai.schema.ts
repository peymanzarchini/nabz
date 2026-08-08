import { z } from "zod";

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, "پیام نمی‌تواند خالی باشد."),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      )
      .default([]),
  }),
});

export type ChatInput = z.infer<typeof chatSchema>["body"];
