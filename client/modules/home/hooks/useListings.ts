import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ListingFilters } from "../types";
import { getListings } from "../services/home.service";

export const useListings = (filters: ListingFilters) => {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData,
  });
};
