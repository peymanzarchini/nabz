import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import {
  getDashboardStats,
  getAdminListings,
  updateListingStatus,
  toggleAmazingOffer,
  getPendingReviews,
  updateReviewStatus,
  getAdminCategories,
  updateCategoryStatus,
} from "../services/admin.service";
import { GetCategory, GetListing } from "@/modules/home/types";
import { Review, Stats } from "../types";
import api from "@/lib/api";

export const useAdminCategories = () => {
  return useQuery<GetCategory[], Error>({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });
};

export const useDashboardStats = () => {
  return useQuery<Stats, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
};

export const useAdminListings = (status: string) => {
  return useQuery<GetListing[], Error>({
    queryKey: ["admin-listings", status],
    queryFn: () => getAdminListings(status),
  });
};

export const useUpdateListingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => updateListingStatus(id, status, rejectionReason),
    onSuccess: () => {
      toast.success("وضعیت آگهی با موفقیت تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useToggleAmazingOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAmazing }: { id: string; isAmazing: boolean }) =>
      toggleAmazingOffer(id, isAmazing),
    onSuccess: () => {
      toast.success("وضعیت پیشنهاد شگفت‌انگیز تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const usePendingReviews = () => {
  return useQuery<Review[], Error>({
    queryKey: ["admin-reviews-pending"],
    queryFn: getPendingReviews,
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => updateReviewStatus(id, status, rejectionReason),
    onSuccess: () => {
      toast.success("وضعیت دیدگاه با موفقیت تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-pending"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCategoryStatus(id, status),
    onSuccess: () => {
      toast.success("وضعیت دسته‌بندی با موفقیت تغییر کرد.");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/marketplace/categories/${id}`),
    onSuccess: () => {
      toast.success("دسته‌بندی با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
