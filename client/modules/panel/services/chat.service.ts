import api from "@/lib/api";
import { Conversation, Message } from "../types";
import { ApiResponse } from "@/types";

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<ApiResponse<Conversation[]>>("/marketplace/conversations");
  return data.body;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await api.get<ApiResponse<Message[]>>(
    `/marketplace/conversations/${conversationId}/messages`,
  );
  return data.body;
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  const { data } = await api.post<ApiResponse<Message>>(
    `/marketplace/conversations/${conversationId}/messages`,
    { content },
  );
  return data.body;
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get<ApiResponse<{ count: number }>>(
    `/marketplace/conversations/unread-count`,
  );
  return data.body.count;
};
