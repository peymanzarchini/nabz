import api from "@/lib/api";
import { GetLocation } from "../types";
import { ApiResponse } from "@/types";

export async function getLocations(): Promise<GetLocation[]> {
  const { data } = await api.get<ApiResponse<GetLocation[]>>("/marketplace/locations");
  return data.body;
}
