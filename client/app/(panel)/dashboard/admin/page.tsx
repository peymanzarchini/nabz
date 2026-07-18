"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Check, X, Zap, Eye } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { GetListing } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import RejectModal from "@/modules/panel/components/RejecModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const AdminListingsPage = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings", filterStatus],
    queryFn: async () => {
      const { data } = await api.get(`/marketplace/listings`, {
        params: { status: filterStatus === "all" ? undefined : filterStatus, limit: 50 },
      });
      return data.body as GetListing[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => {
      await api.patch(`/marketplace/listings/${id}/status`, { status, rejectionReason });
    },
    onSuccess: () => {
      toast.success("وضعیت آگهی با موفقیت تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      setRejectTargetId(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const offerMutation = useMutation({
    mutationFn: async ({ id, isAmazing }: { id: string; isAmazing: boolean }) => {
      await api.patch(`/marketplace/listings/${id}/offer`, { isAmazingOffer: isAmazing });
    },
    onSuccess: () => {
      toast.success("وضعیت پیشنهاد شگفت‌انگیز تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleRejectConfirm = (reason: string) => {
    if (rejectTargetId)
      statusMutation.mutate({ id: rejectTargetId, status: "rejected", rejectionReason: reason });
  };

  const handleApproveConfirm = () => {
    if (approveTargetId) statusMutation.mutate({ id: approveTargetId, status: "active" });
    setApproveTargetId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">
        مدیریت و تایید آگهی‌ها
      </h1>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: "pending", label: "در انتظار تایید" },
          { key: "active", label: "منتشر شده" },
          { key: "rejected", label: "رد شده" },
          { key: "sold", label: "فروخته شده" },
          { key: "all", label: "همه" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key)}
            className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === filter.key
                ? "bg-primary text-primary-foreground"
                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

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
                        {/* دکمه مشاهده */}
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
                            onClick={() => setApproveTargetId(listing.id)}
                            disabled={statusMutation.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                            title="تایید آگهی"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}

                        {(listing.status === "pending" || listing.status === "active") && (
                          <button
                            onClick={() => setRejectTargetId(listing.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="رد آگهی"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            offerMutation.mutate({
                              id: listing.id,
                              isAmazing: !listing.isAmazingOffer,
                            })
                          }
                          disabled={offerMutation.isPending}
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

      <ConfirmModal
        isOpen={!!approveTargetId}
        onClose={() => setApproveTargetId(null)}
        onConfirm={handleApproveConfirm}
        title="تایید آگهی"
        message="آیا از تایید و انتشار این آگهی در سایت مطمئن هستید؟"
        isLoading={statusMutation.isPending}
      />

      <RejectModal
        isOpen={!!rejectTargetId}
        onClose={() => setRejectTargetId(null)}
        onConfirm={handleRejectConfirm}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default AdminListingsPage;
