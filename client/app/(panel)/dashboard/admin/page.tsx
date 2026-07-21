"use client";

import { useState } from "react";
import RejectModal from "@/modules/panel/components/modals/RejecModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  useAdminListings,
  useToggleAmazingOffer,
  useUpdateListingStatus,
} from "@/modules/panel/hooks/useAdmin";
import AdminListingsTable from "@/modules/panel/components/listings/AdminListingsTable";
import AdminListingsTabs from "@/modules/panel/components/listings/AdminListingsTabs";

const AdminListingsPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const { data: listings, isLoading } = useAdminListings(filterStatus);
  const statusMutation = useUpdateListingStatus();
  const offerMutation = useToggleAmazingOffer();

  const handleRejectConfirm = (reason: string) => {
    if (rejectTargetId) {
      statusMutation.mutate({ id: rejectTargetId, status: "rejected", rejectionReason: reason });
      setRejectTargetId(null);
    }
  };

  const handleApproveConfirm = () => {
    if (approveTargetId) {
      statusMutation.mutate({ id: approveTargetId, status: "active" });
      setApproveTargetId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">
        مدیریت و تایید آگهی‌ها
      </h1>

      <AdminListingsTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      <AdminListingsTable
        listings={listings}
        isLoading={isLoading}
        onApprove={(id) => setApproveTargetId(id)}
        onReject={(id) => setRejectTargetId(id)}
        onToggleOffer={(id, isAmazing) => offerMutation.mutate({ id, isAmazing })}
        isOfferLoading={offerMutation.isPending}
        isStatusLoading={statusMutation.isPending}
      />

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
