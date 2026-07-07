import { Request, Response, NextFunction } from "express";
import { conversationService } from "../services/conversation.service.js";
import { SendMessageInput, StartConversationInput } from "../validations/conversation.schema.js";

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
      const result = await conversationService.sendMessage(
        req.user!.id,
        req.body as SendMessageInput,
      );
      res.success("پیام ارسال شد.", result);
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
}

export const conversationController = new ConversationController();
