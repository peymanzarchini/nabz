"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import { getEmoji } from "../constants";

const CategoriesSection = () => {
  const { data: categories, isLoading, isError, error } = useCategories();

  useEffect(() => {
    if (isError && error) {
      let errorMessage = "خطا در دریافت دسته‌بندی‌ها";
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        errorMessage = apiError.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  }, [isError, error]);

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر بخش */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Grid3X3 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">دسته‌بندی‌ها</h2>
              <p className="text-sm text-muted-foreground">هر چی می‌خوای رو اینجا پیدا کن!</p>
            </div>
          </div>

          <Link href="/listings">
            <button className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-1 cursor-pointer">
              مشاهده همه دسته‌بندی‌ها
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/50 dark:bg-gray-900/50 rounded-2xl h-56 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!isLoading && (isError || !categories || categories.length === 0) && (
          <div className="text-center py-12 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-border/30">
            <p className="text-muted-foreground font-medium">
              {isError ? "خطا در بارگذاری دسته‌بندی‌ها" : "هنوز دسته‌بندی‌ای ثبت نشده است."}
            </p>
          </div>
        )}

        {!isLoading && categories && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index: number) => (
              <div
                key={category.id}
                className="group bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-border/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getEmoji(category.icon)}</span>
                  <Link
                    href={`/listings?categoryId=${category.id}`}
                    className="font-bold text-lg text-foreground group-hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                </div>

                {category.subcategories && category.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/listings?categoryId=${sub.id}`}
                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60">زیردسته‌ای ندارد</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
