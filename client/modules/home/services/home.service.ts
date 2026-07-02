import api from "@/lib/api";
import { GetCategory, GetListing } from "../types";
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
