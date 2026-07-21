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
    <div className="bg-white dark:bg-zinc-900 rounded-sm shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredListings && filteredListings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                  تصویر و عنوان
                </th>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300 hidden md:table-cell">
                  قیمت
                </th>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">وضعیت</th>
                <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300 text-left">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => {
                const statusInfo = getStatusInfo(listing.status);
                return (
                  <tr
                    key={listing.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
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
                          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                            {listing.title}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 md:hidden">
                            {listing.minPrice > 0
                              ? Number(listing.minPrice).toLocaleString("fa-IR") + " ت"
                              : "توافقی"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {listing.minPrice > 0
                          ? Number(listing.minPrice).toLocaleString("fa-IR") + " تومان"
                          : "توافقی"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusInfo.color}`}
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
                          <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/dashboard/edit-listing/${listing.id}`}>
                          <button className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={handleDeleteConfirm}
                          disabled={isDeleting}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
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
          <PackageSearch className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
          <p className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
            هنوز آگهی ثبت نکرده‌اید
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            برای شروع فروش، اولین آگهی خود را ایجاد کنید.
          </p>
          <Link href="/dashboard/create-listing">
            <Button className="bg-linear-to-r from-violet-600 to-teal-500 text-white py-5 rounded-sm cursor-pointer">
              ثبت اولین آگهی
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListingsBox;
