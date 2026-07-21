/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useSocket } from "@/lib/providers/SocketProvider";
import { useUnreadCount } from "./useChat";
import { NotificationMessage } from "../types";

export const usePanelLogic = () => {
  const { user, loading, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCount(!!user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (newMessage: NotificationMessage) => {
      if (pathname !== "/dashboard/messages") {
        toast.info("پیام جدید دارید!", {
          description:
            newMessage.content.substring(0, 30) + (newMessage.content.length > 30 ? "..." : ""),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    };

    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("new_notification", handleNotification);
    };
  }, [socket, queryClient, pathname]);

  return {
    user,
    loading,
    logout,
    resolvedTheme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    isMenuOpen,
    setIsMenuOpen,
    mounted,
    isLogoutOpen,
    setIsLogoutOpen,
    menuRef,
    unreadCount,
  };
};
