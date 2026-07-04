/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/lib/api";
import { GetCategory, GetListing, ListingFilters, ListingsResponse } from "../types";
import { ApiResponse } from "@/types";

export async function getCategories(): Promise<GetCategory[]> {
  const { data } = await api.get<ApiResponse<GetCategory[]>>("/marketplace/categories");
  return data.body;
}

export async function getAmazingOfferListing(): Promise<GetListing[]> {
  const { data } = await api.get<ApiResponse<GetListing[]>>("/marketplace/listings", {
    params: {
      isAmazingOffer: "true",
      limit: 8,
      sort: "newest",
    },
  });

  return data.body;
}

export async function getListings(params: ListingFilters): Promise<ListingsResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== ""),
  );

  const { data } = await api.get<ApiResponse<GetListing[]>>("/marketplace/listings", {
    params: cleanParams,
  });

  return {
    items: data.body,
    pagination: {
      totalItems: data.totalItems || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.pageNumber || 1,
      pageSize: data.pageSize || 10,
      hasNextPage: (data.pageNumber || 1) < (data.totalPages || 1),
      hasPrevPage: (data.pageNumber || 1) > 1,
    },
  };
}
