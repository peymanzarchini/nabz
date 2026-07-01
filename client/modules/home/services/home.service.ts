import api from "@/lib/api";
import { GetCategory } from "../types";
import { ApiResponse } from "@/types";

export async function getCategories(): Promise<GetCategory[]> {
  const { data } = await api.get<ApiResponse<GetCategory[]>>("/marketplace/categories");
  return data.body;
}
