/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useSocket } from "@/lib/providers/SocketProvider";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import {
  getMessages,
  sendMessage,
  getUnreadCount,
  getConversations,
} from "../services/chat.service";
import { Conversation, Message } from "../types";

export const useChatSocket = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("🟢 Connected to chat server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("🔴 Disconnected from chat server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return { socket, isConnected };
};

export const useConversations = () => {
  return useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};

export const useMessages = (conversationId: string | null) => {
  return useQuery<Message[], Error>({
    queryKey: ["messages", conversationId],
    queryFn: () => {
      if (!conversationId) return [];
      return getMessages(conversationId);
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, string>({
    mutationFn: (content: string) => {
      if (!conversationId) throw new Error("Conversation ID is missing");
      return sendMessage(conversationId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};

export const useUnreadCount = (enabled: boolean) => {
  return useQuery<number, Error>({
    queryKey: ["unread-count"],
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: 30000,
  });
};

export const useChatRoom = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { data: dbMessages, isLoading: loadingMsgs } = useMessages(activeConvId);
  const sendMessageMutation = useSendMessage(activeConvId);

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

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText.trim());
    socket?.emit("stop_typing", { conversationId: activeConvId });
    setMessageText("");
    setShowEmoji(false);
  };

  const activeConv = conversations?.find((c) => c.id === activeConvId);
  const otherUser = activeConv
    ? activeConv.buyer.id === user?.id
      ? activeConv.seller
      : activeConv.buyer
    : null;

  return {
    user,
    conversations,
    loadingConvs,
    activeConvId,
    setActiveConvId,
    loadingMsgs,
    liveMessages,
    isTyping,
    showEmoji,
    setShowEmoji,
    messageText,
    handleInputChange,
    handleEmojiClick,
    handleSend,
    sendMessageMutation,
    otherUser,
    messagesEndRef,
  };
};
