/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, Menu } from "lucide-react";
import { GetCategory } from "@/modules/home/types";
import { getCategoryIcon } from "@/utils/icon-map";

interface MegaMenuProps {
  categories: GetCategory[] | undefined;
  isLoading: boolean;
}

const MegaMenu = ({ categories, isLoading }: MegaMenuProps) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<GetCategory | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsMegaMenuOpen(false), 200);
  };

  return (
    <div className="relative h-full shrink-0">
      <Button
        variant="outline"
        className="h-full gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary font-medium transition-colors cursor-pointer rounded-sm"
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
            {isLoading && <p className="text-sm text-muted-foreground p-2">در حال بارگذاری...</p>}
            {categories?.map((category) => {
              const Icon = getCategoryIcon(category.icon);
              return (
                <div
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category)}
                  className={`flex items-center justify-between px-4 py-3 rounded-sm cursor-pointer transition-colors group ${
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
                        {sub.name} <ChevronLeft className="h-3 w-3" />
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
                {activeCategory.subcategories && activeCategory.subcategories.length === 0 && (
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
  );
};

export default MegaMenu;
