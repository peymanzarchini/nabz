"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDeleteListing, useGetListings } from "@/modules/panel/hooks/useListings";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ListingsBox from "@/modules/panel/components/listings/ListingsBox";
import ListingsTabs from "@/modules/panel/components/listings/ListingsTabs";

const MyListingsPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { listings, isLoading } = useGetListings();
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  const filteredListings = listings?.filter((listing) => {
    if (filterStatus === "all") return true;
    return listing.status === filterStatus;
  });

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteListing(deleteTargetId, {
        onSettled: () => {
          setDeleteTargetId(null);
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">آگهی‌های من</h1>
        <Link href="/dashboard/create-listing">
          <Button className="bg-linear-to-r from-violet-600 to-teal-500 text-white py-5 rounded-sm cursor-pointer">
            ثبت آگهی جدید
          </Button>
        </Link>
      </div>

      <ListingsTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      <ListingsBox
        filteredListings={filteredListings!}
        handleDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف آگهی"
        message="آیا از حذف این آگهی مطمئن هستید؟ این کار قابل بازگشت نیست و آگهی برای همیشه پاک می‌شود."
        isLoading={isDeleting}
      />
    </>
  );
};

export default MyListingsPage;
