"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard } from "lucide-react";
import { User } from "@/modules/auth/types";
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  user: User | null;
  loading: boolean;
  logout: () => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const AuthButtons = ({ user, loading, logout, isMobile = false, onNavigate }: AuthButtonsProps) => {
  if (loading) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
        {user ? (
          <>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3 mb-2">
              {/* ✅ رنگ آواتار هم به primary تغییر کرد */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={`http://localhost:5000${user.avatar}`}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  user.firstName.charAt(0)
                )}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">خوش آمدید!</p>
              </div>
            </div>

            {/* ✅ دکمه داشبورد در موبایل */}
            <Button
              asChild
              size="lg"
              className="w-full h-12 text-base font-bold cursor-pointer rounded-sm"
            >
              <Link href="/dashboard" onClick={onNavigate}>
                <LayoutDashboard className="h-5 w-5" /> داشبورد
              </Link>
            </Button>

            {/* ✅ دکمه خروج در موبایل */}
            <Button
              variant="destructive"
              size="lg"
              className="w-full h-12 text-base font-bold cursor-pointer rounded-sm"
              onClick={() => {
                logout();
                onNavigate?.();
              }}
            >
              <LogOut className="h-5 w-5" /> خروج از حساب
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {/* ✅ دکمه ورود در موبایل */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-bold cursor-pointer rounded-sm"
            >
              <Link href="/login" onClick={onNavigate}>
                ورود
              </Link>
            </Button>

            {/* ✅ دکمه ثبت‌نام در موبایل */}
            <Button
              asChild
              size="lg"
              className="w-full h-12 text-base font-bold cursor-pointer rounded-sm"
            >
              <Link href="/register" onClick={onNavigate}>
                ثبت‌نام
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ==================== Desktop View ====================
  return (
    <div className="hidden md:flex items-center gap-3">
      {user ? (
        <>
          <Button asChild size="lg" className="h-11 text-sm font-bold cursor-pointer rounded-sm">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> داشبورد
            </Link>
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="h-11 text-sm font-bold cursor-pointer rounded-sm"
            onClick={logout}
          >
            خروج <LogOut className="h-4 w-4 rotate-180" />
          </Button>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 text-sm font-bold cursor-pointer rounded-sm"
          >
            <Link href="/login">ورود</Link>
          </Button>

          <Button asChild size="lg" className="h-11 text-sm font-bold cursor-pointer rounded-sm">
            <Link href="/register">ثبت‌نام</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
