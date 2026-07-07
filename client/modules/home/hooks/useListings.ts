import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ListingFilters } from "../types";
import { getListingById, getListings } from "../services/home.service";

export const useListings = (filters: ListingFilters) => {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
    placeholderData: keepPreviousData,
  });
};

export const useListingDetails = (id: string) => {
  return useQuery({
    queryKey: ["listing-details", id],
    queryFn: () => getListingById(id),
    enabled: !!id,
  });
};
