import { z } from "zod";

export const startConversationSchema = z.object({
  body: z.object({
    listingId: z.coerce.number().int().positive("آیدی آگهی الزامی است"),
    message: z.string().trim().min(1, "متن پیام نمی‌تواند خالی باشد"),
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    conversationId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    content: z.string().trim().min(1, "متن پیام نمی‌تواند خالی باشد"),
  }),
});

export const getConversationMessagesSchema = z.object({
  params: z.object({
    conversationId: z.coerce.number().int().positive(),
  }),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>["body"];
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
