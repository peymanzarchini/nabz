"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, Loader2, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history: ChatMessage[];
}

type FormSubmitHandler = NonNullable<React.ComponentProps<"form">["onSubmit"]>;

const AiAssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsingTool, setIsUsingTool] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend: FormSubmitHandler = async (e): Promise<void> => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmedInput };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsUsingTool(false);

    try {
      const requestBody: ChatRequestBody = {
        message: trimmedInput,
        history: messages,
      };

      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("ReadableStream not yet supported in this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "");
            try {
              const data = JSON.parse(jsonStr);

              if (data.type === "text") {
                setIsUsingTool(false);
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsgIndex = updated.length - 1;
                  if (updated[lastMsgIndex].role === "assistant") {
                    updated[lastMsgIndex].content += data.content;
                  }
                  return updated;
                });
              } else if (data.type === "tool_use") {
                setIsUsingTool(true);
              } else if (data.type === "done") {
                setIsUsingTool(false);
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (parseError) {
              console.error("Parse error:", parseError);
            }
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "خطای ناشناخته";
      toast.error(errorMessage);

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsgIndex = updated.length - 1;
        if (updated[lastMsgIndex]?.role === "assistant" && updated[lastMsgIndex].content === "") {
          updated[lastMsgIndex].content = "متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.";
        } else {
          updated.push({ role: "assistant", content: "متاسفانه خطایی رخ داد." });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsUsingTool(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-sm shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-teal-500 flex items-center justify-center text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-800 dark:text-white">دستیار هوشمند نبض</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            تحلیل آمار و نظرات با هوش مصنوعی
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-950">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400">
            <Bot className="h-20 w-20 mb-6 text-zinc-200 dark:text-zinc-700" />
            <p className="font-bold text-lg text-zinc-700 dark:text-zinc-200 mb-2">
              سلام! من دستیار هوشمند نبض هستم.
            </p>
            <p className="text-sm max-w-lg leading-6">
              می‌تونی ازم بخوای کامنت‌های یک آگهی رو تحلیل کنم یا آمار داشبوردت رو بهت بگم.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${
                  msg.role === "user"
                    ? "bg-zinc-500 dark:bg-zinc-700"
                    : "bg-linear-to-tr from-violet-600 to-teal-500"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tr-none"
                    : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-7 whitespace-pre-wrap">
                  {msg.content}
                  {isLoading && idx === messages.length - 1 && msg.role === "assistant" && (
                    <span className="inline-block w-2 h-4 bg-violet-500 animate-pulse mr-1 align-middle"></span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && isUsingTool && (
          <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 ml-12 animate-pulse">
            <Wrench className="h-4 w-4" />
            در حال بررسی دیتابیس و استخراج اطلاعات...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-white dark:bg-zinc-900"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 h-12 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="bg-linear-to-r from-violet-600 to-teal-500 text-white h-12 w-12 rounded-sm cursor-pointer shrink-0"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
};

export default AiAssistantPage;
