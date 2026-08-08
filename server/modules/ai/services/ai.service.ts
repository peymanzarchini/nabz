import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { Response } from "express";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { aiTools, executeTool } from "../utils/ai.tools.js";

const genAI = new GoogleGenerativeAI(env.ai.apiKey || "dummy_key_for_dev");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class AiService {
  async chatWithAssistantStream(
    userId: string,
    role: string,
    history: ChatMessage[],
    userMessage: string,
    res: Response,
  ) {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: aiTools,
      systemInstruction: `تو یک دستیار هوشمند داخل سوپراپلیکیشن نبض هستی. کاربر با نقش ${role} و آیدی ${userId} با تو صحبت می‌کنه. تو می‌تونی برای تحلیل کامنت‌ها یا گرفتن آمار از توابع استفاده کنی. جواب‌هات رو به زبان فارسی و دوستانه بده.`,
    });

    const geminiHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
    });

    let currentInput: string | Part[] = userMessage;

    while (true) {
      const streamResult = await chat.sendMessageStream(currentInput);

      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ type: "text", content: chunkText })}\n\n`);
        }
      }

      const response = await streamResult.response;
      const functionCalls = response.functionCalls();

      if (functionCalls && functionCalls.length > 0) {
        const functionResponses: Part[] = [];

        for (const call of functionCalls) {
          try {
            logger.info(`AI is calling tool: ${call.name}`);
            res.write(`data: ${JSON.stringify({ type: "tool_use", name: call.name })}\n\n`);

            const result = await executeTool(call.name, call.args as Record<string, unknown>);

            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: { result: result },
              },
            });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: { error: errorMessage },
              },
            });
          }
        }

        currentInput = functionResponses;
      } else {
        break;
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  }
}

export const aiService = new AiService();
