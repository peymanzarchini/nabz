"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import { getCategoryIcon } from "@/utils/icon-map";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Grid3X3 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">دسته‌بندی‌ها</h2>
              <p className="text-sm text-muted-foreground">هر چی می‌خوای رو اینجا پیدا کن!</p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10 rounded-sm group cursor-pointer"
          >
            <Link href="/listings">
              مشاهده همه دسته‌بندی‌ها
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl h-24 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!isLoading && (isError || !categories || categories.length === 0) && (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground font-medium">
              {isError ? "خطا در بارگذاری دسته‌بندی‌ها" : "هنوز دسته‌بندی‌ای ثبت نشده است."}
            </p>
          </div>
        )}

        {!isLoading && categories && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index: number) => {
              const Icon = getCategoryIcon(category.icon);
              return (
                <Link
                  key={category.id}
                  href={`/listings?categoryId=${category.id}`}
                  className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">مشاهده آگهی‌ها</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
