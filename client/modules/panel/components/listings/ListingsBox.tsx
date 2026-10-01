import { Eye, Loader2, PackageSearch, Pencil, Trash2 } from "lucide-react";
import { getStatusInfo } from "../../utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetListing } from "@/modules/home/types";

interface ListingsBoxProps {
  isLoading: boolean;
  filteredListings: GetListing[];
  handleDeleteConfirm: () => void;
  isDeleting: boolean;
}

const ListingsBox = ({
  isLoading,
  filteredListings,
  isDeleting,
  handleDeleteConfirm,
}: ListingsBoxProps) => {
  return (
    <div className="bg-card rounded-sm shadow-sm border border-border overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredListings && filteredListings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="p-4 text-sm font-bold text-muted-foreground">تصویر و عنوان</th>
                <th className="p-4 text-sm font-bold text-muted-foreground hidden md:table-cell">
                  قیمت
                </th>
                <th className="p-4 text-sm font-bold text-muted-foreground">وضعیت</th>
                <th className="p-4 text-sm font-bold text-muted-foreground text-left">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => {
                const statusInfo = getStatusInfo(listing.status);
                return (
                  <tr
                    key={listing.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-sm bg-muted overflow-hidden shrink-0">
                          {listing.thumbnail && (
                            <Image
                              src={`http://localhost:5000${listing.thumbnail}`}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                              width={56}
                              height={56}
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="max-w-50 sm:max-w-xs">
                          <p className="text-sm font-bold text-foreground truncate">
                            {listing.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 md:hidden">
                            {listing.minPrice > 0
                              ? Number(listing.minPrice).toLocaleString("fa-IR") + " ت"
                              : "توافقی"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-foreground">
                        {listing.minPrice > 0
                          ? Number(listing.minPrice).toLocaleString("fa-IR") + " تومان"
                          : "توافقی"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-sm ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/listings/${listing.category?.slug || "unknown"}/${listing.slug}`}
                          target="_blank"
                        >
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-sm transition-colors cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/dashboard/edit-listing/${listing.id}`}>
                          <button className="p-2 text-muted-foreground hover:bg-muted rounded-sm transition-colors cursor-pointer">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={handleDeleteConfirm}
                          disabled={isDeleting}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageSearch className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-lg font-bold text-foreground mb-2">هنوز آگهی ثبت نکرده‌اید</p>
          <p className="text-sm text-muted-foreground mb-6">
            برای شروع فروش، اولین آگهی خود را ایجاد کنید.
          </p>
          <Button asChild className="py-5 rounded-sm cursor-pointer">
            <Link href="/dashboard/create-listing">ثبت اولین آگهی</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingsBox;
