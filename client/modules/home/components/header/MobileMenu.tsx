"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { GetCategory } from "@/modules/home/types";
import { getCategoryIcon } from "@/utils/icon-map";
import SearchWithPreview from "./SearchWithPreview";
import ThemeToggle from "./ThemeToggle";
import AuthButtons from "./AuthButtons";
import { User } from "@/modules/auth/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: GetCategory[] | undefined;
  isLoading: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  categories,
  isLoading,
  user,
  loading,
  logout,
}: MobileMenuProps) => {
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/30 shadow-xl animate-slide-up max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <SearchWithPreview isMobile onClose={onClose} />
          <ThemeToggle isMobile />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-semibold px-3 mb-2">دسته‌بندی‌ها</p>
          {isLoading && <p className="text-sm text-muted-foreground p-3">در حال بارگذاری...</p>}
          {categories?.map((category) => {
            const isOpenCat = activeMobileCategory === category.id;
            const Icon = getCategoryIcon(category.icon);
            return (
              <div key={category.id} className="border-b border-border/20 last:border-0">
                <div
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => setActiveMobileCategory(isOpenCat ? null : category.id)}
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-medium flex-1">{category.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpenCat ? "rotate-180" : ""}`}
                  />
                </div>

                {isOpenCat && (
                  <div className="animate-slide-up pr-10 pb-4 space-y-4">
                    <Link
                      href={`/listings?categoryId=${category.id}`}
                      onClick={onClose}
                      className="text-sm font-bold text-primary hover:underline block"
                    >
                      مشاهده همه {category.name}
                    </Link>
                    {category.subcategories?.map((sub) => (
                      <div key={sub.id} className="space-y-2">
                        <Link
                          href={`/listings?categoryId=${sub.id}`}
                          onClick={onClose}
                          className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          {sub.name} <ChevronLeft className="h-3 w-3" />
                        </Link>
                        {sub.subcategories && sub.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pr-2">
                            {sub.subcategories.map((subSub) => (
                              <Link
                                key={subSub.id}
                                href={`/listings?categoryId=${subSub.id}`}
                                onClick={onClose}
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

        <AuthButtons user={user} loading={loading} logout={logout} isMobile onNavigate={onClose} />
      </div>
    </div>
  );
};

export default MobileMenu;
