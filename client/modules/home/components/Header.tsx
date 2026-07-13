/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { categoryIcons } from "../constants/category-icon";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getCategoryIcon } from "@/utils/icon-map";

const Header = () => {
  const { data: categories, isLoading } = useCategories();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout, loading } = useAuth();

  type CategoryItem = NonNullable<typeof categories>[number];

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/30 dark:border-white/30 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex shrink-0">
          <Logo width={70} height={70} />
        </div>

        <div className="hidden md:flex flex-1 items-center gap-2 h-12 mx-4">
          <div className="relative h-full">
            <Button
              variant="outline"
              className="h-full gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary font-medium transition-colors cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Menu className="h-5 w-5" />
              دسته‌بندی‌ کالاها
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {isMegaMenuOpen && (
              <div
                className="absolute top-17 right-0 w-250 bg-background/95 backdrop-blur-2xl border border-border shadow-lg animate-slide-up z-50 flex overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-1/3 border-l border-border/30 bg-secondary/10 p-4 flex flex-col gap-1">
                  {isLoading && (
                    <p className="text-sm text-muted-foreground p-2">در حال بارگذاری...</p>
                  )}
                  {categories?.map((category) => {
                    const Icon = getCategoryIcon(category.icon);

                    return (
                      <div
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors group ${
                          activeCategory?.id === category.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-sm">{category.name}</span>
                        </div>

                        <ChevronLeft className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                    );
                  })}
                </div>

                <div className="w-2/3 p-6">
                  {activeCategory ? (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">
                        همه {activeCategory.name}
                      </h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {activeCategory.subcategories?.map((sub) => (
                          <div key={sub.id} className="space-y-2">
                            <Link
                              href={`/listings?categoryId=${sub.id}`}
                              className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              {sub.name}
                              <ChevronLeft className="h-3 w-3" />
                            </Link>
                            {sub.subcategories && sub.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {sub.subcategories.map((subSub) => (
                                  <Link
                                    key={subSub.id}
                                    href={`/listings?categoryId=${subSub.id}`}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    {subSub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {activeCategory.subcategories &&
                        activeCategory.subcategories.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            زیردسته‌ای برای این دسته‌بندی ثبت نشده است.
                          </p>
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">یک دسته‌بندی را انتخاب کنید</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <InputGroup className="h-full">
            <InputGroupAddon>
              <Search className="h-5 w-5 text-muted-foreground mr-5" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="جستجو در نبض..."
              className="bg-secondary/50 border-border/30 focus:border-primary transition-colors text-base rounded-xl"
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 group cursor-pointer"
                aria-label="تغییر تم"
              >
                <span
                  className={`absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-500 ${
                    resolvedTheme === "dark"
                      ? "bg-linear-to-tr from-yellow-400/20 to-orange-500/20 group-hover:shadow-lg group-hover:shadow-yellow-500/30"
                      : "bg-linear-to-tr from-indigo-400/20 to-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  }`}
                ></span>
                {resolvedTheme === "dark" ? (
                  <Sun className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-transform duration-500 group-hover:rotate-45 relative z-10" />
                ) : (
                  <Moon className="h-6 w-6 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)] transition-transform duration-500 group-hover:-rotate-12 relative z-10" />
                )}
              </button>
            )}

            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2 rounded-md bg-linear-to-r from-violet-600 to-teal-500 text-white shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer text-sm font-bold flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    داشبورد
                  </Link>
                  <button
                    onClick={logout}
                    className="px-5 py-2 rounded-md border border-red-400 text-red-500 transition-all duration-200 hover:bg-red-50 cursor-pointer text-sm font-bold flex items-center gap-2"
                  >
                    خروج
                    <LogOut className="h-4 w-4 rotate-180" />
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
              ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl border border-border/30 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/30 shadow-xl animate-slide-up max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="جستجو در نبض..."
                  className="pr-10 bg-secondary/50 border-border/30 focus:border-primary transition-colors h-12 rounded-lg text-base"
                />
              </div>

              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 group cursor-pointer shrink-0 border border-border/30"
                  aria-label="تغییر تم"
                >
                  <span
                    className={`absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-500 ${
                      resolvedTheme === "dark"
                        ? "bg-linear-to-tr from-yellow-400/20 to-orange-500/20"
                        : "bg-linear-to-tr from-indigo-400/20 to-blue-500/20"
                    }`}
                  ></span>
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400 relative z-10" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-600 relative z-10" />
                  )}
                </button>
              )}
            </div>

            {/* لیست دسته‌بندی‌ها (اکاردئون) */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold px-3 mb-2">دسته‌بندی‌ها</p>
              {isLoading && <p className="text-sm text-muted-foreground p-3">در حال بارگذاری...</p>}
              {categories?.map((category) => {
                const isOpen = activeMobileCategory === category.id;
                const Icon = categoryIcons[category.slug] ?? categoryIcons.default;
                return (
                  <div key={category.id} className="border-b border-border/20 last:border-0">
                    <div
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => setActiveMobileCategory(isOpen ? null : category.id)}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-medium flex-1">{category.name}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    {isOpen && (
                      <div className="animate-slide-up pr-10 pb-4 space-y-4">
                        <Link
                          href={`/listings?categoryId=${category.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-bold text-primary hover:underline block"
                        >
                          مشاهده همه {category.name}
                        </Link>

                        {category.subcategories?.map((sub) => (
                          <div key={sub.id} className="space-y-2">
                            <Link
                              href={`/listings?categoryId=${sub.id}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              {sub.name}
                              <ChevronLeft className="h-3 w-3" />
                            </Link>

                            {sub.subcategories && sub.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pr-2">
                                {sub.subcategories.map((subSub) => (
                                  <Link
                                    key={subSub.id}
                                    href={`/listings?categoryId=${subSub.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    {subSub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* دکمه‌های احراز هویت موبایل */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
              {!loading &&
                (user ? (
                  <>
                    <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.firstName.charAt(0)}
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
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full px-6 py-3.5 rounded-lg bg-linear-to-r from-violet-600 to-teal-500 text-white text-center font-bold shadow-md transition-all cursor-pointer text-base flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      داشبورد
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3.5 rounded-lg border border-red-400 text-red-500 text-center font-semibold transition-all hover:bg-red-50 cursor-pointer text-base flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-5 w-5" />
                      خروج از حساب
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-3.5 rounded-lg border border-primary text-primary text-center font-semibold transition-all duration-200 hover:bg-primary/5 cursor-pointer text-base"
                    >
                      ورود
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-3.5 rounded-lg bg-primary text-primary-foreground text-center font-bold shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/40 cursor-pointer text-base"
                    >
                      ثبت‌نام
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
