"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Star, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

interface Review {
  id: string;
  rating: number | null;
  comment: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; avatar: string | null };
}

interface Props {
  listingId: string;
}

const ReviewsSection = ({ listingId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", listingId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Review[]>>(
        `/marketplace/listings/${listingId}/reviews`,
      );
      return data.body;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newReview: { rating: number; comment: string }) => {
      await api.post(`/marketplace/listings/${listingId}/reviews`, newReview);
    },
    onSuccess: () => {
      toast.success("دیدگاه شما با موفقیت ثبت شد و در انتظار تایید مدیر است.");
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("لطفاً امتیاز را انتخاب کنید.");
    if (comment.trim().length < 5) return toast.error("متن دیدگاه باید حداقل ۵ کاراکتر باشد.");
    mutation.mutate({ rating, comment });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        دیدگاه کاربران ({reviews?.length || 0})
      </h2>

      <div className="mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2 block">
                امتیاز شما
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-current"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2 block">
                دیدگاه شما
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="تجربه خود را از این محصول بنویسید..."
                className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 min-h-25"
              />
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-linear-to-r from-violet-600 to-teal-500 text-white rounded-sm cursor-pointer"
            >
              {mutation.isPending ? <Loader2 className="animate-spin ml-2" /> : null}
              ثبت دیدگاه
            </Button>
          </form>
        ) : (
          <p className="text-center text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg">
            برای ثبت دیدگاه، لطفاً ابتدا وارد حساب کاربری خود شوید.
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                {review.user.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${review.rating && review.rating >= star ? "text-yellow-400 fill-current" : "text-zinc-300 dark:text-zinc-600"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-6">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500 py-8">
          هنوز دیدگاهی برای این آگهی ثبت نشده است.
        </p>
      )}
    </div>
  );
};

export default ReviewsSection;
