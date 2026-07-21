"use client";

import { useState } from "react";
import RejectModal from "@/modules/panel/components/modals/RejecModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { usePendingReviews, useUpdateReviewStatus } from "@/modules/panel/hooks/useAdmin";
import AdminReviewsTable from "@/modules/panel/components/AdminReviewsTable";

const AdminReviewsPage = () => {
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const { data: reviews, isLoading } = usePendingReviews();
  const statusMutation = useUpdateReviewStatus();

  const handleApproveConfirm = () => {
    if (approveTargetId) statusMutation.mutate({ id: approveTargetId, status: "approved" });
  };

  const handleRejectConfirm = (reason: string) => {
    if (rejectTargetId)
      statusMutation.mutate({ id: rejectTargetId, status: "rejected", rejectionReason: reason });
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">مدیریت دیدگاه‌ها</h1>

      <AdminReviewsTable
        isLoading={isLoading}
        reviews={reviews!}
        setApproveTargetId={setApproveTargetId}
        setRejectTargetId={setRejectTargetId}
        statusMutation={statusMutation}
      />

      <ConfirmModal
        isOpen={!!approveTargetId}
        onClose={() => setApproveTargetId(null)}
        onConfirm={handleApproveConfirm}
        title="تایید دیدگاه"
        message="آیا از تایید و انتشار این دیدگاه در سایت مطمئن هستید؟"
        isLoading={statusMutation.isPending}
      />

      <RejectModal
        isOpen={!!rejectTargetId}
        onClose={() => setRejectTargetId(null)}
        onConfirm={handleRejectConfirm}
        isLoading={statusMutation.isPending}
        title="رد دیدگاه"
        buttonTitle="تایید و رد دیدگاه"
      />
    </div>
  );
};

export default AdminReviewsPage;
