"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Eye, Loader2, X, Zap } from "lucide-react";
import { GetListing } from "@/modules/home/types";

interface AdminListingsTableProps {
  listings: GetListing[] | undefined;
  isLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleOffer: (id: string, isAmazing: boolean) => void;
  isOfferLoading: boolean;
  isStatusLoading: boolean;
}

const AdminListingsTable = ({
  listings,
  isLoading,
  onApprove,
  onReject,
  onToggleOffer,
  isOfferLoading,
  isStatusLoading,
}: AdminListingsTableProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">آگهی</th>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300 hidden md:table-cell">
                  فروشنده
                </th>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300 text-left">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 relative">
                        {listing.thumbnail && (
                          <Image
                            src={listing.thumbnail}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="max-w-xs">
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {listing.minPrice > 0
                            ? Number(listing.minPrice).toLocaleString("fa-IR") + " تومان"
                            : "توافقی"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {listing.user?.firstName} {listing.user?.lastName}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/listings/${listing.category?.slug || "unknown"}/${listing.slug}`}
                        target="_blank"
                      >
                        <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>

                      {(listing.status === "pending" || listing.status === "rejected") && (
                        <button
                          onClick={() => onApprove(listing.id)}
                          disabled={isStatusLoading}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                          title="تایید آگهی"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}

                      {(listing.status === "pending" || listing.status === "active") && (
                        <button
                          onClick={() => onReject(listing.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="رد آگهی"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onToggleOffer(listing.id, !listing.isAmazingOffer)}
                        disabled={isOfferLoading}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          listing.isAmazingOffer
                            ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                            : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                        title="پیشنهاد شگفت‌انگیز"
                      >
                        <Zap className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
            آگهی‌ای در این وضعیت وجود ندارد
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminListingsTable;
