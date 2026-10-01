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
    <div className="bg-card rounded-sm shadow-sm border border-border overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="p-4 text-sm font-bold text-muted-foreground">آگهی</th>
                <th className="p-4 text-sm font-bold text-muted-foreground hidden md:table-cell">
                  فروشنده
                </th>
                <th className="p-4 text-sm font-bold text-muted-foreground text-left">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-sm bg-muted overflow-hidden shrink-0 relative">
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
                        <p className="text-sm font-bold text-foreground truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {listing.minPrice > 0
                            ? Number(listing.minPrice).toLocaleString("fa-IR") + " تومان"
                            : "توافقی"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {listing.user?.firstName} {listing.user?.lastName}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {listing.status === "active" && (
                        <Link
                          href={`/listings/${listing.category?.slug || "unknown"}/${listing.slug}`}
                          target="_blank"
                        >
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-sm transition-colors cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                      )}

                      {(listing.status === "pending" || listing.status === "rejected") && (
                        <button
                          onClick={() => onApprove(listing.id)}
                          disabled={isStatusLoading}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-sm transition-colors cursor-pointer"
                          title="تایید آگهی"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}

                      {(listing.status === "pending" || listing.status === "active") && (
                        <button
                          onClick={() => onReject(listing.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-sm transition-colors cursor-pointer"
                          title="رد آگهی"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onToggleOffer(listing.id, !listing.isAmazingOffer)}
                        disabled={isOfferLoading}
                        className={`p-2 rounded-sm transition-colors cursor-pointer ${
                          listing.isAmazingOffer
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-muted-foreground hover:bg-muted"
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
          <p className="text-lg font-bold text-foreground mb-2">آگهی‌ای در این وضعیت وجود ندارد</p>
        </div>
      )}
    </div>
  );
};

export default AdminListingsTable;
