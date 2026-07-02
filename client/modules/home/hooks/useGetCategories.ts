import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/home.service";
import { GetCategory } from "../types";

export const useCategories = () => {
  return useQuery<GetCategory[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
