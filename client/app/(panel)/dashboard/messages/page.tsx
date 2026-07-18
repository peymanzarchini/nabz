/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Send, MessageSquare, CheckCheck, Smile, ArrowRight } from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme, EmojiClickData } from "emoji-picker-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/lib/providers/SocketProvider";
import { useAuth } from "@/lib/providers/AuthProvider";
import { ApiResponse } from "@/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

interface ConversationUser {
  id: string;
  firstName: string;
  lastName: string;
  lastSeen: string | null;
  avatar: string | null;
}

interface Conversation {
  id: string;
  listing: { id: string; title: string; thumbnail: string | null };
  buyer: ConversationUser;
  seller: ConversationUser;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: conversations, isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Conversation[]>>(`/marketplace/conversations`);
      return data.body;
    },
  });

  const { data: dbMessages, isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", activeConvId],
    queryFn: async () => {
      if (!activeConvId) return [];
      const { data } = await api.get<ApiResponse<Message[]>>(
        `/marketplace/conversations/${activeConvId}/messages`,
      );
      return data.body;
    },
    enabled: !!activeConvId,
  });

  useEffect(() => {
    setLiveMessages(dbMessages || []);
  }, [dbMessages]);

  useEffect(() => {
    if (activeConvId) {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  }, [activeConvId, queryClient]);

  useEffect(() => {
    if (!socket || !activeConvId) return;

    socket.emit("join_conversation", activeConvId);
    socket.emit("seen", { conversationId: activeConvId, userId: user?.id });

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.conversationId === activeConvId) {
        setLiveMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        socket.emit("seen", { conversationId: activeConvId, userId: user?.id });
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleTyping = () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    };

    const handleStopTyping = () => setIsTyping(false);

    const handleSeen = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === activeConvId) {
        setLiveMessages((prev) =>
          prev.map((m) => (m.senderId === user?.id ? { ...m, isRead: true } : m)),
        );
      }
    };

    const handleUserStatus = (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      queryClient.setQueryData<Conversation[]>(["conversations"], (oldConvs) => {
        if (!oldConvs) return oldConvs;
        return oldConvs.map((conv) => {
          if (conv.buyer.id === data.userId) {
            return {
              ...conv,
              buyer: {
                ...conv.buyer,
                lastSeen: data.isOnline ? null : data.lastSeen || new Date().toISOString(),
              },
            };
          }
          if (conv.seller.id === data.userId) {
            return {
              ...conv,
              seller: {
                ...conv.seller,
                lastSeen: data.isOnline ? null : data.lastSeen || new Date().toISOString(),
              },
            };
          }
          return conv;
        });
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("seen", handleSeen);
    socket.on("user_status", handleUserStatus);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("seen", handleSeen);
      socket.off("user_status", handleUserStatus);
    };
  }, [socket, activeConvId, user?.id, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (socket && activeConvId) {
      socket.emit("typing", { conversationId: activeConvId, userId: user?.id });
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post<ApiResponse<Message>>(
        `/marketplace/conversations/${activeConvId}/messages`,
        { content },
      );
      return data.body;
    },
    onSuccess: (savedMessage) => {
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === savedMessage.id)) {
          return prev.map((m) =>
            m.id === savedMessage.id ? { ...m, ...savedMessage, isRead: false } : m,
          );
        }
        return [...prev, { ...savedMessage, isRead: false }];
      });
      socket?.emit("stop_typing", { conversationId: activeConvId });
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText.trim());
    setShowEmoji(false);
  };

  const activeConv = conversations?.find((c) => c.id === activeConvId);
  const otherUser = activeConv
    ? activeConv.buyer.id === user?.id
      ? activeConv.seller
      : activeConv.buyer
    : null;

  const formatLastSeen = (dateStr: string | null) => {
    if (!dateStr) return "آنلاین";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "همین الان";
    if (mins < 60) return `${mins} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${days} روز پیش`;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
      {/* لیست مکالمات - در موبایل اگر چت انتخاب شده باشد مخفی میشود */}
      <div
        className={`${activeConvId ? "hidden md:flex" : "flex"} w-full md:w-80 border-l border-zinc-100 dark:border-zinc-800 flex-col`}
      >
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-white">پیام‌ها</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conv) => {
              const convOtherUser = conv.buyer.id === user?.id ? conv.seller : conv.buyer;
              const isOnline = !convOtherUser.lastSeen;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${activeConvId === conv.id ? "bg-violet-50 dark:bg-violet-500/10" : ""}`}
                >
                  <div className="flex items-center gap-3 relative">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden">
                        {convOtherUser.avatar ? (
                          <Image
                            src={`http://localhost:5000${convOtherUser.avatar}`}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          convOtherUser.firstName.charAt(0)
                        )}
                      </div>
                      <span
                        className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${isOnline ? "bg-blue-500" : "bg-zinc-400"}`}
                      ></span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm text-zinc-800 dark:text-zinc-100 truncate">
                        {convOtherUser.firstName}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{conv.listing.title}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-zinc-500">هنوز مکالمه‌ای ندارید.</div>
          )}
        </div>
      </div>

      {/* پنجره چت - در موبایل اگر چت انتخاب شده باشد نمایش داده میشود */}
      <div className={`${activeConvId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        {!activeConvId || !otherUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <MessageSquare className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-lg font-bold text-zinc-800 dark:text-white">
              یک مکالمه را انتخاب کنید
            </p>
            <p className="text-sm text-zinc-500">
              برای شروع گفتگو، روی یکی از مکالمات سمت راست کلیک کنید.
            </p>
          </div>
        ) : (
          <>
            {/* هدر چت */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden text-zinc-500 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden">
                  {otherUser.avatar ? (
                    <Image
                      src={`http://localhost:5000${otherUser.avatar}`}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    otherUser.firstName.charAt(0)
                  )}
                </div>
                <span
                  className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${!otherUser.lastSeen ? "bg-blue-500" : "bg-zinc-400"}`}
                ></span>
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                  {otherUser.firstName} {otherUser.lastName}
                </p>
                <p className="text-xs text-zinc-500">
                  {!otherUser.lastSeen ? (
                    <span className="text-blue-500">آنلاین</span>
                  ) : (
                    `آخرین بازدید: ${formatLastSeen(otherUser.lastSeen)}`
                  )}
                </p>
              </div>
            </div>

            {/* بدنه پیام‌ها */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
              {loadingMsgs ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                liveMessages.map((msg) => (
                  <div
                    key={msg.id || msg.createdAt}
                    className={`flex ${msg.senderId === user?.id ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${msg.senderId === user?.id ? "bg-primary text-white rounded-bl-none" : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-br-none shadow-sm"}`}
                    >
                      <p className="text-sm leading-6 break-all whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p
                          className={`text-[10px] ${msg.senderId === user?.id ? "text-white/70" : "text-zinc-400"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {msg.senderId === user?.id && (
                          <CheckCheck
                            className={`h-3.5 w-3.5 ${msg.isRead ? "text-blue-300" : "text-white/50"}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="bg-white dark:bg-zinc-800 text-zinc-500 text-sm p-3 rounded-2xl rounded-br-none shadow-sm">
                    در حال نوشتن...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* فرم ارسال پیام */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 relative"
            >
              {showEmoji && (
                <div className="absolute bottom-16 right-4 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={resolvedTheme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                  />
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-zinc-500 hover:text-primary cursor-pointer"
              >
                <Smile className="h-6 w-6" />
              </Button>
              <Input
                value={messageText}
                onChange={handleInputChange}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              />
              <Button
                type="submit"
                size="icon"
                disabled={sendMessageMutation.isPending}
                className="bg-linear-to-r from-violet-600 to-teal-500 text-white h-11 w-11 rounded-lg cursor-pointer"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
