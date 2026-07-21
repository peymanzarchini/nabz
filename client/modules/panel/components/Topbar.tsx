import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { User } from "@/modules/auth/types";
import { ChevronDown, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, RefObject, SetStateAction } from "react";

interface TopbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setTheme: Dispatch<SetStateAction<string>>;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  setIsLogoutOpen: Dispatch<SetStateAction<boolean>>;
  resolvedTheme: string;
  mounted: boolean;
  isMenuOpen: boolean;
  user: User;
  menuRef: RefObject<HTMLDivElement | null>;
}

const Topbar = ({
  setSidebarOpen,
  setTheme,
  setIsMenuOpen,
  resolvedTheme,
  setIsLogoutOpen,
  mounted,
  isMenuOpen,
  user,
  menuRef,
}: TopbarProps) => {
  return (
    <header className="h-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5! h-5!" />
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
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                تنظیمات حساب
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLogoutOpen(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-right cursor-pointer"
              >
                <LogOut className="h-4 w-4 rotate-180" />
                خروج از حساب
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
