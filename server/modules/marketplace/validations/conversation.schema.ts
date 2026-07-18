import { z } from "zod";

export const startConversationSchema = z.object({
  body: z.object({
    listingId: z.uuid("آیدی وارد شده نامعتبر است"),
    message: z.string().trim().min(1, "متن پیام نمی‌تواند خالی باشد"),
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    conversationId: z.uuid("آیدی وارد شده نامعتبر است"),
  }),
  body: z.object({
    content: z.string().trim().min(1, "متن پیام نمی‌تواند خالی باشد"),
  }),
});

export const getConversationMessagesSchema = z.object({
  params: z.object({
    conversationId: z.uuid("آیدی وارد شده نامعتبر است"),
  }),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>["body"];
export type SendMessageInput = {
  conversationId: string;
  content: string;
};
