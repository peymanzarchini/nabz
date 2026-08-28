"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, Percent, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAmazingOffers } from "../../hooks/useAmazingOffer";
import { ApiErrorResponse } from "@/types";
import AmazingOfferCard from "./AmazingOfferCard";

const AmazingOffersSection = () => {
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
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
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

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-sm cursor-pointer font-semibold"
          >
            <Link href="/listings?isAmazingOffer=true">
              مشاهده همه
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl h-72 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!isLoading && (isError || !offers || offers.length === 0) && (
          <div className="text-center py-16 bg-card border border-border rounded-2xl flex flex-col items-center justify-center">
            <div className="flex justify-center mb-4">
              {isError ? (
                <AlertCircle className="h-12 w-12 text-destructive" />
              ) : (
                <Percent className="h-12 w-12 text-muted-foreground/50" />
              )}
            </div>
            <p className="text-foreground font-bold text-lg mb-1">
              {isError ? "خطا در بارگذاری اطلاعات" : "فعلاً پیشنهاد ویژه‌ای نداریم"}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {isError
                ? "لطفاً کمی بعد دوباره تلاش کنید."
                : "به زودی تخفیف‌های استثنایی به این بخش اضافه خواهند شد."}
            </p>
          </div>
        )}

        {!isLoading && offers && offers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {offers.map((offer, index) => (
              <AmazingOfferCard key={offer.id} offer={offer} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AmazingOffersSection;
