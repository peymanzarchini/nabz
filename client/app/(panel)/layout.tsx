/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackagePlus,
  ListOrdered,
  MessageSquare,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useTheme } from "next-themes";

const panelLinks = [
  {
    href: "/dashboard",
    label: "نمای کلی",
    icon: LayoutDashboard,
    roles: ["admin", "seller", "customer"],
  },
  {
    href: "/dashboard/listings",
    label: "آگهی‌های من",
    icon: ListOrdered,
    roles: ["seller", "admin"],
  },
  {
    href: "/dashboard/create-listing",
    label: "ثبت آگهی جدید",
    icon: PackagePlus,
    roles: ["seller", "admin"],
  },
  {
    href: "/dashboard/messages",
    label: "پیام‌ها",
    icon: MessageSquare,
    roles: ["admin", "seller", "customer"],
  },
  { href: "/dashboard/admin", label: "مدیریت سایت", icon: ShieldCheck, roles: ["admin"] },
  {
    href: "/dashboard/settings",
    label: "تنظیمات",
    icon: Settings,
    roles: ["admin", "seller", "customer"],
  },
];

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

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
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 fixed inset-y-0 right-0 z-50">
        <div className="h-20 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          <Logo width={50} height={50} />
          <span className="text-xl font-black mr-2 text-zinc-800 dark:text-white">داشبورد نبض</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
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
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
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
              <Button variant="outline" size="sm">
                مشاهده سایت
              </Button>
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {user.firstName.charAt(0)}
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
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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
    </div>
  );
};

export default DashLayout;
