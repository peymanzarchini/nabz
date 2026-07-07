"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Percent, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAmazingOffers } from "../hooks/useAmazingOffer";
import { ApiErrorResponse } from "@/types";

export const AmazingOffersSection = () => {
  const { data: offers, isLoading, isError, error } = useAmazingOffers();

  useEffect(() => {
    if (isError && error) {
      let errorMessage = "خطا در دریافت اطلاعات از سرور";

      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        errorMessage = apiError.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }, [isError, error]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-accent/5 to-background dark:from-primary/20 dark:via-accent/10 dark:to-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                پیشنهادهای شگفت‌انگیز
              </h2>
              <p className="text-sm text-muted-foreground">
                تخفیف‌های لحظه‌ای نبض را از دست ندهید!
              </p>
            </div>
          </div>

          <Link href="/listings?isAmazingOffer=true">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 rounded-xl group cursor-pointer"
            >
              مشاهده همه
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/50 dark:bg-gray-900/50 rounded-2xl h-72 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!isLoading && (isError || !offers || offers.length === 0) && (
          <div className="text-center py-16 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-border/30">
            <div className="flex justify-center mb-4">
              {isError ? (
                <AlertCircle className="h-12 w-12 text-destructive" />
              ) : (
                <Percent className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <p className="text-foreground font-bold text-lg mb-1">
              {isError ? "خطا در بارگذاری اطلاعات" : "فعلاً پیشنهاد ویژه‌ای نداریم"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isError
                ? "لطفاً کمی بعد دوباره تلاش کنید."
                : "به زودی تخفیف‌های استثنایی به این بخش اضافه خواهند شد."}
            </p>
          </div>
        )}

        {!isLoading && offers && offers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {offers.map((offer, index: number) => {
              const maxDiscount =
                offer.variants && offer.variants.length > 0
                  ? Math.max(...offer.variants.map((v) => v.discountPercentage || 0))
                  : 0;

              const minFinalPrice =
                offer.variants && offer.variants.length > 0
                  ? Math.min(...offer.variants.map((v) => v.finalPrice || v.price))
                  : offer.minPrice;

              return (
                <Link
                  key={offer.id}
                  href={`/listings/${offer.category?.slug || "unknown"}/${offer.slug}`}
                  className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative aspect-square bg-secondary/50 p-4 flex items-center justify-center overflow-hidden">
                    {maxDiscount > 0 ? (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg z-10 flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {maxDiscount}%
                      </div>
                    ) : null}

                    {offer.thumbnail ? (
                      <Image
                        src={
                          offer.thumbnail.startsWith("http")
                            ? offer.thumbnail
                            : `http://localhost:5000${offer.thumbnail}`
                        }
                        alt={offer.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-muted-foreground/50">
                        <Zap className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {offer.title}
                    </h3>

                    <div className="flex flex-col items-end gap-1">
                      <span className="font-black text-base text-foreground">
                        {minFinalPrice > 0 ? minFinalPrice.toLocaleString("fa-IR") : "توافقی"}
                        {minFinalPrice > 0 && (
                          <span className="text-[10px] font-normal text-muted-foreground mr-1">
                            تومان
                          </span>
                        )}
                      </span>

                      {maxDiscount > 0 && offer.minPrice > minFinalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {Number(offer.minPrice).toLocaleString("fa-IR")}
                        </span>
                      )}
                    </div>
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
