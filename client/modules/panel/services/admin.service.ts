import { ApiResponse } from "@/types";
import { Review, Stats } from "../types";
import api from "@/lib/api";
import { GetListing } from "@/modules/home/types";

export const getDashboardStats = async (): Promise<Stats> => {
  const { data } = await api.get<ApiResponse<Stats>>("/marketplace/stats");
  return data.body;
};

export const getAdminListings = async (status: string): Promise<GetListing[]> => {
  const { data } = await api.get<ApiResponse<GetListing[]>>(`/marketplace/listings`, {
    params: { status: status === "all" ? undefined : status, limit: 50 },
  });
  return data.body;
};

export const updateListingStatus = async (
  id: string,
  status: string,
  rejectionReason?: string,
): Promise<void> => {
  await api.patch(`/marketplace/listings/${id}/status`, { status, rejectionReason });
};

export const toggleAmazingOffer = async (id: string, isAmazing: boolean): Promise<void> => {
  await api.patch(`/marketplace/listings/${id}/offer`, { isAmazingOffer: isAmazing });
};

export const getPendingReviews = async (): Promise<Review[]> => {
  const { data } = await api.get(`/marketplace/reviews/pending`);
  return data.body;
};

export const updateReviewStatus = async (
  id: string,
  status: string,
  rejectionReason?: string,
): Promise<void> => {
  await api.patch(`/marketplace/reviews/${id}/status`, { status, rejectionReason });
};
