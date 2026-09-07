import { Button } from "@/components/ui/button";
import { Check, Loader2, MessageSquare, Star, X } from "lucide-react";
import { Review } from "../types";
import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "@tanstack/react-query";

interface AdminReviewsTableProps {
  isLoading: boolean;
  reviews: Review[];
  setApproveTargetId: Dispatch<SetStateAction<string | null>>;
  setRejectTargetId: Dispatch<SetStateAction<string | null>>;
  statusMutation: UseMutationResult<
    void,
    Error,
    {
      id: string;
      status: string;
      rejectionReason?: string;
    },
    unknown
  >;
}

const AdminReviewsTable = ({
  isLoading,
  reviews,
  statusMutation,
  setApproveTargetId,
  setRejectTargetId,
}: AdminReviewsTableProps) => {
  return (
    <div className="bg-card rounded-sm shadow-sm border border-border overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {review.user.firstName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-foreground">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    {review.rating && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${review.rating && review.rating >= star ? "text-amber-400 fill-current" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-primary mb-2">برای: {review.listing.title}</p>
                  <p className="text-sm text-muted-foreground leading-6 bg-muted/40 p-3 rounded-sm">
                    {review.comment}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:flex-col md:items-end shrink-0">
                <Button
                  size="sm"
                  onClick={() => setApproveTargetId(review.id)}
                  disabled={statusMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-sm py-4"
                >
                  <Check className="h-4 w-4 ml-1" />
                  تایید دیدگاه
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectTargetId(review.id)}
                  disabled={statusMutation.isPending}
                  className="border-destructive text-destructive hover:bg-destructive/10 cursor-pointer rounded-sm py-4"
                >
                  <X className="h-4 w-4 ml-1" />
                  رد دیدگاه
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-bold text-foreground mb-2">
            دیدگاهی در انتظار تایید وجود ندارد
          </p>
          <p className="text-sm text-muted-foreground">
            دیدگاه‌های جدید اینجا نمایش داده خواهند شد.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsTable;
