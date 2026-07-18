/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Menu, X, LogOut, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useTheme } from "next-themes";
import { panelLinks } from "@/modules/panel/data";
import { useSocket } from "@/lib/providers/SocketProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

interface NotificationMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
}

const PanelContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

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

  const { data: unreadCount } = useQuery<number>({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ count: number }>>(
        `/marketplace/conversations/unread-count`,
      );
      return data.body.count;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
        <Link href="/login">
          <Button>ورود به نبض</Button>
        </Link>
      </div>
    );
  }

  const filteredLinks = panelLinks.filter((link) => link.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* سایدبار دسکتاپ */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 fixed inset-y-0 right-0 z-50">
        <div className="h-20 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          <Logo width={50} height={50} />
          <span className="text-xl font-black mr-2 text-zinc-800 dark:text-white">داشبورد نبض</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            const isMessagesLink = link.href === "/dashboard/messages";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors relative ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {isMessagesLink && unreadCount !== undefined && unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white dark:bg-zinc-900 h-full flex flex-col">
            <div className="h-20 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4">
              <div className="flex items-center">
                <Logo width={40} height={40} />
                <span className="text-lg font-black mr-2 text-zinc-800 dark:text-white">
                  داشبورد
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredLinks.map((link) => {
                const isActive = pathname === link.href;
                const isMessagesLink = link.href === "/dashboard/messages";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                    {isMessagesLink && unreadCount !== undefined && unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-72 flex flex-col">
        <header className="h-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="lg:hidden">
              <Logo width={40} height={40} />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-white">
                خوش آمدی، {user.firstName}!
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="تغییر تم"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            <Link href="/" target="_blank" className="hidden sm:block">
              <Button variant="outline" size="sm" className="rounded-sm text-xs cursor-pointer">
                مشاهده سایت
              </Button>
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={`http://localhost:5000${user.avatar}`}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    user.firstName.charAt(0)
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-500 hidden sm:block" />
              </button>

              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-2 animate-slide-up z-50">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-700 mb-1">
                    <p className="font-semibold text-sm text-zinc-800 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    تنظیمات حساب
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLogoutOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-right"
                  >
                    <LogOut className="h-4 w-4" />
                    خروج از حساب
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsLogoutOpen(false)}
          />
          <div className="relative bg-white dark:bg-zinc-900 rounded-sm shadow-2xl w-full max-w-md p-6 animate-slide-up text-center">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-4">خروج از حساب</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              آیا از خروج از حساب کاربری خود مطمئن هستید؟
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 dark:border-zinc-700 dark:text-zinc-200 rounded-sm"
                onClick={() => setIsLogoutOpen(false)}
              >
                انصراف
              </Button>
              <Button
                variant="destructive"
                className="flex-1 cursor-pointer rounded-sm"
                onClick={() => {
                  logout();
                  setIsLogoutOpen(false);
                }}
              >
                خروج
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelContent;
