import { Request, Response } from "express";
import { aiService } from "../services/ai.service.js";
import { ChatInput } from "../validations/ai.schema.js";

class AiController {
  async chat(req: Request<unknown, unknown, ChatInput>, res: Response): Promise<void> {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const { message, history } = req.body;
      const userId = req.user!.id;
      const role = req.user!.role;

      await aiService.chatWithAssistantStream(userId, role, history, message, res);
    } catch (error) {
      console.log(error);
      res.write(`data: ${JSON.stringify({ type: "error", message: "خطای سرور" })}\n\n`);
      res.end();
    }
  }
}

export const aiController = new AiController();
