import { Request, Response, NextFunction } from "express";
import { conversationService } from "../services/conversation.service.js";
import { StartConversationInput } from "../validations/conversation.schema.js";
import { Conversation } from "../models/conversation.model.js";

class ConversationController {
  async startOrGetConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await conversationService.startOrGetConversation(
        req.user!.id,
        req.body as StartConversationInput,
      );
      res.success("گفت‌وگو با موفقیت شروع شد.", result);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const content = req.body.content as string;
      const senderId = req.user!.id;

      const message = await conversationService.sendMessage(senderId, { conversationId, content });

      const io = req.app.get("io");
      if (io) {
        const conv = await Conversation.findByPk(conversationId);
        if (conv) {
          const recipientId = conv.buyerId === senderId ? conv.sellerId : conv.buyerId;

          io.to(`user:${recipientId}`).emit("new_notification", message);

          io.to(conversationId).emit("receive_message", message);
        }
      }

      res.success("پیام ارسال شد.", message);
    } catch (error) {
      next(error);
    }
  }

  async getUserConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await conversationService.getUserConversations(req.user!.id);
      res.success("لیست گفت‌وگوها.", result);
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const conversationId = req.params.conversationId as string;
      const result = await conversationService.getConversationMessages(
        conversationId,
        req.user!.id,
      );
      res.success("لیست پیام‌ها.", result);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await conversationService.getUnreadCount(req.user!.id);
      res.success("Unread count", { count });
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
