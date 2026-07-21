"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard } from "lucide-react";
import { User } from "@/modules/auth/types";

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
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
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
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="w-full px-6 py-3.5 rounded-lg bg-linear-to-r from-violet-600 to-teal-500 text-white text-center font-bold shadow-md transition-all cursor-pointer text-base flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="h-5 w-5" /> داشبورد
            </Link>
            <button
              onClick={() => {
                logout();
                onNavigate?.();
              }}
              className="w-full px-6 py-3.5 rounded-lg border border-red-400 text-red-500 text-center font-semibold transition-all hover:bg-red-50 cursor-pointer text-base flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" /> خروج از حساب
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={onNavigate}
              className="block w-full px-6 py-3.5 rounded-lg border border-primary text-primary text-center font-semibold transition-all duration-200 hover:bg-primary/5 cursor-pointer text-base"
            >
              ورود
            </Link>
            <Link
              href="/register"
              onClick={onNavigate}
              className="block w-full px-6 py-3.5 rounded-lg bg-primary text-primary-foreground text-center font-bold shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/40 cursor-pointer text-base"
            >
              ثبت‌نام
            </Link>
          </>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className="hidden md:flex items-center gap-3">
      {user ? (
        <>
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-sm bg-linear-to-r from-violet-600 to-teal-500 text-white shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer text-sm font-bold flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" /> داشبورد
          </Link>
          <button
            onClick={logout}
            className="px-5 py-2 rounded-sm border border-red-400 text-red-500 transition-all duration-200 hover:bg-red-50 cursor-pointer text-sm font-bold flex items-center gap-2"
          >
            خروج <LogOut className="h-4 w-4 rotate-180" />
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-md border border-primary text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5 cursor-pointer"
          >
            ورود
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm cursor-pointer"
          >
            ثبت‌نام
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
