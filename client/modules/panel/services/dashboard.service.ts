import api from "@/lib/api";
import { GetLocation } from "../types";
import { ApiResponse } from "@/types";
import { GetListing } from "@/modules/home/types";

export async function getLocations(): Promise<GetLocation[]> {
  const { data } = await api.get<ApiResponse<GetLocation[]>>("/marketplace/locations");
  return data.body;
}

export async function getListings(userId: string): Promise<GetListing[]> {
  const { data } = await api.get<ApiResponse<GetListing[]>>("/marketplace/listings", {
    params: { userId, limit: 50 },
  });
  return data.body;
}

export async function deleteListing(id: string): Promise<void> {
  const { data } = await api.delete(`/marketplace/listings/${id}`);
  return data;
}
