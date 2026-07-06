"use client";

import { use, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Star, BadgeCheck, PackageSearch, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingDetails } from "@/modules/home/hooks/useListings";
import { ListingVariant } from "@/modules/home/types";
import ListingGallery from "@/modules/home/components/ListingGallery";
import ListingSpecs from "@/modules/home/components/ListingSpecs";
import ListingVariants from "@/modules/home/components/ListingVariants";

const ListingMap = dynamic(() => import("@/modules/home/components/ListingMap"), {
  ssr: false,
  loading: () => <div className="h-75 bg-zinc-50 dark:bg-zinc-800 rounded-2xl animate-pulse" />,
});

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "text-yellow-400 fill-current"
              : "text-zinc-300 dark:text-zinc-600"
          }`}
        />
      ))}
    </div>
  );
};

const ListingDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const listingId = Number(id);
  const { data: listing, isLoading, isError } = useListingDetails(listingId);
  const [selectedVariant, setSelectedVariant] = useState<ListingVariant | null>(null);

  console.log(listing);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl h-100 animate-pulse" />
            <div className="bg-white dark:bg-zinc-900 rounded-2xl h-50 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl h-75 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm max-w-md w-full mx-4">
          <PackageSearch className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-zinc-800 dark:text-white font-bold text-lg">آگهی یافت نشد</p>
          <p className="text-sm text-zinc-500 mt-2">
            ممکن است آگهی حذف شده باشد یا لینک اشتباه باشد.
          </p>
        </div>
      </div>
    );
  }

  const getNumericPrice = () => {
    if (selectedVariant) {
      const vPrice =
        Number(selectedVariant.finalPrice) > 0
          ? Number(selectedVariant.finalPrice)
          : Number(selectedVariant.price);
      return vPrice > 0 ? vPrice : Number(listing.minPrice);
    }
    return Number(listing.minPrice);
  };

  const numericPrice = getNumericPrice();

  const hasVariants = listing.variants && listing.variants.length > 1;
  const isFree = numericPrice === 0;
  const isNew = listing.condition === "new";
  const locationText = [listing.city?.name, listing.district?.name].filter(Boolean).join("، ");
  const lat = Number(listing.latitude);
  const lng = Number(listing.longitude);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">توضیحات</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-7 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <ListingSpecs specs={listing.specs} specsSchema={listing.category?.specsSchema} />

            {lat && lng && <ListingMap lat={lat} lng={lng} cityName={listing.city?.name || ""} />}
          </div>

          <div className="space-y-6 lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm sticky top-28">
              {/* عنوان و امتیاز */}
              <div className="mb-4">
                <h1 className="text-xl font-black text-zinc-900 dark:text-white mb-2 leading-8">
                  {listing.title}
                </h1>
                {listing.reviewCount > 0 ? (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={listing.averageRating} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({listing.averageRating.toFixed(1)}) از {listing.reviewCount} نظر
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={0} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      هنوز نظری ثبت نشده است
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span>{locationText || "نامشخص"}</span>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-md ${isNew ? "bg-emerald-500/90 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"}`}
                >
                  {isNew ? "نو" : "دست دوم"}
                </span>
              </div>

              {/* واریانت‌ها */}
              {hasVariants && listing.variants && (
                <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <ListingVariants
                    variants={listing.variants}
                    specsSchema={listing.category?.specsSchema || null}
                    onVariantChange={(v) => setSelectedVariant(v)}
                  />
                </div>
              )}

              {/* قیمت */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-end gap-1">
                  {isFree ? (
                    <span className="text-2xl font-black text-primary">توافقی</span>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-zinc-900 dark:text-white">
                        {numericPrice.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-xs font-normal text-zinc-500 mb-1.5">تومان</span>
                    </>
                  )}
                </div>
                {selectedVariant && (
                  <p className="text-xs text-zinc-500 mt-1">
                    موجودی: {selectedVariant.stock > 0 ? `${selectedVariant.stock} عدد` : "ناموجود"}
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="w-full h-12 text-base mb-3"
                disabled={selectedVariant?.stock === 0}
              >
                <MessageCircle className="h-5 w-5 ml-2" />
                شروع گفتگو با فروشنده
              </Button>
              <Button variant="outline" size="lg" className="w-full h-12 text-base">
                اطلاعات تماس
              </Button>
            </div>

            {/* باکس فروشنده */}
            {listing.user && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4">
                  اطلاعات فروشنده
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {listing.user.firstName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                      {listing.user.firstName} {listing.user.lastName}
                      <BadgeCheck className="h-4 w-4 text-accent" />
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      کاربر تایید شده نبض
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
