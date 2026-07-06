"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck, Tag, Zap } from "lucide-react";
import { GetListing } from "../types";

const ListingCard = ({ listing, index = 0 }: { listing: GetListing; index?: number }) => {
  const numericPrice = Number(listing.minPrice || 0);
  const isFree = numericPrice === 0;
  const isNew = listing.condition === "new";
  const locationText = [listing.city?.name, listing.district?.name].filter(Boolean).join("، ");

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-4/3 bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
        {listing.thumbnail ? (
          <Image
            src={listing.thumbnail}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-200 dark:text-zinc-700">
            <Tag className="h-20 w-20" />
          </div>
        )}

        {listing.isAmazingOffer && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
            <Zap className="h-3 w-3" /> شگفت‌انگیز
          </span>
        )}

        <span
          className={`absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-md ${isNew ? "bg-emerald-500/90 text-white" : "bg-zinc-900/70 text-zinc-100"}`}
        >
          {isNew ? "نو" : "دست دوم"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-6 min-h-12 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {locationText && (
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            {listing.user ? (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="w-5 h-5 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-[9px]">
                  {listing.user.firstName.charAt(0)}
                </div>
                <span className="truncate max-w-17.5">{listing.user.firstName}</span>
                <BadgeCheck className="h-3.5 w-3.5 text-accent" />
              </div>
            ) : (
              <div />
            )}

            {listing.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                <span>{listing.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-end gap-1">
              {isFree ? (
                <span className="font-extrabold text-lg text-primary">توافقی</span>
              ) : (
                <>
                  <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                    {numericPrice.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[10px] font-normal text-zinc-500 mb-1">تومان</span>
                </>
              )}
            </div>
            {!isFree && <span className="text-[10px] text-zinc-400">حداقل قیمت</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
